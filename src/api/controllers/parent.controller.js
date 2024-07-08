const { AsyncParser } = require("@json2csv/node");
const nodemailer = require("nodemailer");

const httpStatus = require("http-status");
const Parent = require("../models/parent.model");
const approvalModel = require("../models/approval.model");
const { omit } = require("lodash");
const GeneratePagination = require("../utils/generatePagination");

/**
 * Load parent and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const parent = await Parent.get(id);
    req.locals = { parent };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get parent
 * @public
 */
exports.get = (req, res) => res.json(req.locals.parent.transform());

/**
 * Create new parent
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const parent = new Parent(req.body);
    const savedParent = await parent.save();

    const approvalBody = {
      seekedBy: req.user.transform().id,
      type: "add",
      status: "requested",
      parentID: savedParent._id,
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
      "Seseorang telah mengajukan request penambahan data wali murid baru, silahkan cek di sistem untuk menyetujui atau menolak request.";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "[SI-YAPEMRI] APPROVAL BARU (TAMBAH DATA WALI MURID)",
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(httpStatus.CREATED);
    res.json(savedParent.transform());
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { parent } = req.locals;

    await parent.updateOne(req.body);
    const savedParent = await Parent.findById(parent._id);
    res.json(savedParent.transform());

    const existingApproval = await approvalModel.findOne({
      seekedBy: req.user.transform().id,
      parentID: parent._id,
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
        parentID: req.params.parentId,
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
      "Seseorang telah mengajukan request pengubahan data wali murid yang sudah ada, silahkan cek di sistem untuk menyetujui atau menolak request.";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "[SI-YAPEMRI] APPROVAL BARU (UBAH DATA WALI MURID)",
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Get parent list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const pageParent = parseInt(req.query.pageParent);
    const limitParent = parseInt(req.query.limitParent);

    let offset, parents, transformedParents, totalRecords;

    if (!pageParent && !limitParent) {
      parents = await Parent.list({});
      transformedParents = parents.map((parent) => parent.transform());

      res.json({
        data: transformedParents,
      });
    } else {
      offset = (pageParent - 1) * limitParent;

      parents = await Parent.list({ limitParent, offset });
      transformedParents = parents.map((parent) => parent.transform());

      totalRecords = await Parent.count();

      res.json({
        data: transformedParents,
        pagination: GeneratePagination(limitParent, pageParent, totalRecords),
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
    const parents = await Parent.filteredCount(filter);
    res.json(parents);
  } catch (error) {
    next(error);
  }
};

/**
 * Get download parent list
 * @public
 */
exports.download = async (req, res, next) => {
  try {
    const params = req.query || {};
    const parents = await Parent.listDownload(params);
    const transformedParents = parents.map((parent) => parent.transform());

    if (transformedParents.length !== 0) {
      const opts = {};
      const transformOpts = {};
      const asyncOpts = {};
      const parser = new AsyncParser(opts, transformOpts, asyncOpts);
      const csv = await parser.parse(transformedParents).promise();

      if (params.start && params.end) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' +
            `parent_report_start_${new Date(
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
            `parent_report_end_${new Date(
              params.end
            ).toLocaleDateString()}.csv` +
            '"'
        );
      } else if (!params.end && params.start) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' +
            `parent_report_start_${new Date(
              params.start
            ).toLocaleDateString()}.csv` +
            '"'
        );
      } else {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' + "parent_report_all.csv" + '"'
        );
      }

      res.status(200).send(csv);
    } else if (transformedParents.length === 0) {
      res.status(400).send();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get father list
 * @public
 */
exports.listFathers = async (req, res, next) => {
  try {
    const parents = await Parent.listFathers(req.query);
    const transformedParents = parents.map((parent) => parent.transform());
    res.json(transformedParents);
  } catch (error) {
    next(error);
  }
};

/**
 * Get mother list
 * @public
 */
exports.listMothers = async (req, res, next) => {
  try {
    const parents = await Parent.listMothers(req.query);
    const transformedParents = parents.map((parent) => parent.transform());
    res.json(transformedParents);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete parent (change status)
 * @public
 */
exports.remove = async (req, res, next) => {
  const updatedParent = omit({ ...req.body, dataStatus: "reviewed" });
  const parent = Object.assign(req.locals.parent, updatedParent);

  parent.save().then((savedParent) => res.json(savedParent.transform()));

  const existingApproval = await approvalModel.findOne({
    seekedBy: req.user.transform().id,
    parentID: parent._id,
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
      parentID: req.params.parentId,
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
    "Seseorang telah mengajukan request penghapusan data wali murid yang sudah ada, silahkan cek di sistem untuk menyetujui atau menolak request.";

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "[SI-YAPEMRI] APPROVAL BARU (HAPUS DATA WALI MURID)",
    text: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Delete parent
 * @public
 */
exports.hardRemove = (req, res, next) => {
  const { parent } = req.locals;

  parent
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
