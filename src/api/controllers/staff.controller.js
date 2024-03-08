const { AsyncParser } = require("@json2csv/node");

const httpStatus = require("http-status");
const Staff = require("../models/staff.model");
const approvalModel = require("../models/approval.model");
const { omit } = require("lodash");
const GeneratePagination = require("../utils/generatePagination");

/**
 * Load staff and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const staff = await Staff.get(id);
    req.locals = { staff };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get staff
 * @public
 */
exports.get = (req, res) => res.json(req.locals.staff.transform());

/**
 * Create new staff
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const staff = new Staff(req.body);
    const savedStaff = await staff.save();

    const approvalBody = {
      seekedBy: req.user.transform().id,
      type: "add",
      status: "requested",
      staffID: savedStaff._id,
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
      "Seseorang telah mengajukan request penambahan data staff baru, silahkan cek di sistem untuk menyetujui atau menolak request.";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "[SI-YAPEMRI] APPROVAL BARU (TAMBAH DATA STAFF)",
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(httpStatus.CREATED);
    res.json(savedStaff.transform());
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { staff } = req.locals;

    await staff.updateOne(req.body);
    const savedStaff = await Staff.findById(staff._id);
    res.json(savedStaff.transform());

    const existingApproval = await approvalModel.findOne({
      seekedBy: req.user.transform().id,
      staffID: staff._id,
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
        staffID: req.params.staffId,
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
      "Seseorang telah mengajukan request pengubahan data staff yang sudah ada, silahkan cek di sistem untuk menyetujui atau menolak request.";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "[SI-YAPEMRI] APPROVAL BARU (UBAH DATA STAFF)",
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Get staff list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    let offset, staffs, transformedStaffs, totalRecords;

    if (!page && !limit) {
      staffs = await Staff.list({});
      transformedStaffs = staffs.map((staff) => staff.transform());

      res.json({
        data: transformedStaffs,
      });
    } else {
      offset = (page - 1) * limit;

      staffs = await Staff.list({ limit, offset });
      transformedStaffs = staffs.map((staff) => staff.transform());

      totalRecords = await Staff.count();

      res.json({
        data: transformedStaffs,
        pagination: GeneratePagination(limit, page, totalRecords),
      });
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
    const staffs = await Staff.filteredCount(filter);
    res.json(staffs);
  } catch (error) {
    next(error);
  }
};

/**
 * Get download staff list
 * @public
 */
exports.download = async (req, res, next) => {
  try {
    const params = req.query || {};
    const staffs = await Staff.listDownload(params);
    const transformedStaffs = staffs.map((staff) => staff.transform());

    if (transformedStaffs.length !== 0) {
      const opts = {};
      const transformOpts = {};
      const asyncOpts = {};
      const parser = new AsyncParser(opts, transformOpts, asyncOpts);
      const csv = await parser.parse(transformedStaffs).promise();

      if (params.start && params.end) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' +
            `staff_report_start_${new Date(
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
            `staff_report_end_${new Date(
              params.end
            ).toLocaleDateString()}.csv` +
            '"'
        );
      } else if (!params.end && params.start) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' +
            `staff_report_start_${new Date(
              params.start
            ).toLocaleDateString()}.csv` +
            '"'
        );
      } else {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' + "staff_report_all.csv" + '"'
        );
      }

      res.status(200).send(csv);
    } else if (transformedStaffs.length === 0) {
      res.status(400).send();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete staff (change status)
 * @public
 */
exports.remove = async (req, res, next) => {
  const updatedStaff = omit({ ...req.body, dataStatus: "reviewed" });
  const staff = Object.assign(req.locals.staff, updatedStaff);

  staff.save().then((savedStaff) => res.json(savedStaff.transform()));

  const existingApproval = await approvalModel.findOne({
    seekedBy: req.user.transform().id,
    staffID: staff._id,
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
      staffID: req.params.staffId,
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
    "Seseorang telah mengajukan request penghapusan data staff yang sudah ada, silahkan cek di sistem untuk menyetujui atau menolak request.";

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "[SI-YAPEMRI] APPROVAL BARU (HAPUS DATA STAFF)",
    text: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Delete staff
 * @public
 */
exports.hardRemove = (req, res, next) => {
  const { staff } = req.locals;

  staff
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
