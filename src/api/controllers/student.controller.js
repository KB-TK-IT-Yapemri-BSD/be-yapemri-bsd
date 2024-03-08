const { AsyncParser } = require("@json2csv/node");

const httpStatus = require("http-status");
const Student = require("../models/student.model");
const approvalModel = require("../models/approval.model");
const { omit } = require("lodash");
const GeneratePagination = require("../utils/generatePagination");

/**
 * Load student and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const student = await Student.get(id);
    req.locals = { student };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get student
 * @public
 */
exports.get = (req, res) => res.json(req.locals.student.transform());

/**
 * Create new student
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();

    const approvalBody = {
      seekedBy: req.user.transform().id,
      type: "add",
      status: "requested",
      studentID: savedStudent._id,
    };

    approvalModel.create(approvalBody);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.TRANSPORT_USERNAME,
        pass: process.env.TRANSPORT_PASSWORD,
      },
    });

    const emailContent =
      "Seseorang telah mengajukan request penambahan data murid baru, silahkan cek di sistem untuk menyetujui atau menolak request.";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "[SI-YAPEMRI] APPROVAL BARU (TAMBAH DATA MURID)",
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(httpStatus.CREATED);
    res.json(savedStudent.transform());
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { student } = req.locals;

    await student.updateOne(req.body);
    const savedStudent = await Student.findById(student._id);
    res.json(savedStudent.transform());

    const existingApproval = await approvalModel.findOne({
      seekedBy: req.user.transform().id,
      studentID: student._id,
      status: "requested",
    });
    if (existingApproval) {
      await approvalModel.findOneAndUpdate(
        {
          _id: existingApproval._id,
          seekedBy: req.user.transform().id,
          status: "requested",
        },
        { type: "edit" }
      );
    } else {
      await approvalModel.create({
        seekedBy: req.user.transform().id,
        type: "edit",
        status: "requested",
        studentID: req.params.studentId,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.TRANSPORT_USERNAME,
        pass: process.env.TRANSPORT_PASSWORD,
      },
    });

    const emailContent =
      "Seseorang telah mengajukan request pengubahan data murid yang sudah ada, silahkan cek di sistem untuk menyetujui atau menolak request.";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "[SI-YAPEMRI] APPROVAL BARU (UBAH DATA MURID)",
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Get student list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    let offset, students, transformedStudents, totalRecords;

    if (!page && !limit) {
      students = await Student.list({});
      transformedStudents = students.map((student) => student.transform());

      res.json({
        data: transformedStudents,
      });
    } else {
      offset = (page - 1) * limit;

      students = await Student.list({ limit, offset });
      transformedStudents = students.map((student) => student.transform());

      totalRecords = await Student.count();

      res.json({
        data: transformedStudents,
        pagination: GeneratePagination(limit, page, totalRecords),
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get student count
 * @public
 */
exports.dashboard = async (req, res, next) => {
  try {
    const students = await Student.formCount();
    res.json(students);
    {
      /**
        const transformedForms = registrations.map((registration) => registration.transform());
        res.json(transformedForms);
         */
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get count of each property
 * @public
 */
exports.count = async (req, res, next) => {
  try {
    const filter = req.query || {};
    const students = await Student.filteredCount(filter);
    res.json(students);
    {
      /**
        const transformedForms = registrations.map((registration) => registration.transform());
        res.json(transformedForms);
         */
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get download student list
 * @public
 */
exports.download = async (req, res, next) => {
  try {
    const params = req.query || {};
    const students = await Student.listDownload(params);
    const transformedStudents = students.map((student) => student.transform());

    if (transformedStudents.length !== 0) {
      const opts = {};
      const transformOpts = {};
      const asyncOpts = {};
      const parser = new AsyncParser(opts, transformOpts, asyncOpts);
      const csv = await parser.parse(transformedStudents).promise();

      if (params.start && params.end) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' +
            `student_report_start_${new Date(
              params.start
            ).toLocaleDateString()}_end_${new Date(
              params.end
            ).toLocaleDateString()}.csv` +
            '"'
        );
      } else if (!params.start && params.end) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' +
            `student_report_end_${new Date(
              params.end
            ).toLocaleDateString()}.csv` +
            '"'
        );
      } else if (!params.end && params.start) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' +
            `student_report_start_${new Date(
              params.start
            ).toLocaleDateString()}.csv` +
            '"'
        );
      } else {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' + "student_report_all.csv" + '"'
        );
      }

      res.status(200).send(csv);
    } else if (transformedStudents.length === 0) {
      res.status(400).send();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete student (change status)
 * @public
 */
exports.remove = async (req, res, next) => {
  const updatedStudent = omit({ ...req.body, dataStatus: "reviewed" });
  const student = Object.assign(req.locals.student, updatedStudent);

  student.save().then((savedStudent) => res.json(savedStudent.transform()));

  const existingApproval = await approvalModel.findOne({
    seekedBy: req.user.transform().id,
    studentID: student._id,
    status: "requested",
  });
  if (existingApproval) {
    await approvalModel.findOneAndUpdate(
      {
        _id: existingApproval._id,
        seekedBy: req.user.transform().id,
        status: "requested",
      },
      { type: "delete" }
    );
  } else {
    await approvalModel.create({
      seekedBy: req.user.transform().id,
      type: "delete",
      status: "requested",
      studentID: req.params.studentId,
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.TRANSPORT_USERNAME,
      pass: process.env.TRANSPORT_PASSWORD,
    },
  });

  const emailContent =
    "Seseorang telah mengajukan request penghapusan data murid yang sudah ada, silahkan cek di sistem untuk menyetujui atau menolak request.";

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "[SI-YAPEMRI] APPROVAL BARU (HAPUS DATA MURID)",
    text: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Delete student
 * @public
 */
exports.hardRemove = (req, res, next) => {
  const { student } = req.locals;

  student
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
