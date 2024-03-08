const { AsyncParser } = require("@json2csv/node");
const nodemailer = require("nodemailer");

const httpStatus = require("http-status");
const { omit } = require("lodash");
const User = require("../models/user.model");
const { handleFileUploadPicture } = require("../../config/cloudinary");
const approvalModel = require("../models/approval.model");
const GeneratePagination = require("../utils/generatePagination");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    const approvalBody = {
      seekedBy: req.user.transform().id,
      type: "add",
      status: "requested",
      userID: savedUser._id,
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
      "Seseorang telah mengajukan request penambahan akun baru, silahkan cek di sistem untuk menyetujui atau menolak request.";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "[SI-YAPEMRI] APPROVAL BARU (TAMBAH DATA AKUN)",
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    // const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), "_id");

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
  let receiptUploaded = "";

  if (req.file) {
    receiptUploaded = await handleFileUploadPicture(req.file.path);
  }

  const updatedUser = omit({ ...req.body, picture: receiptUploaded });
  const user = Object.assign(req.locals.user, updatedUser);

  user
    .save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(User.checkDuplicateEmail(e)));

  const existingApproval = await approvalModel.findOne({
    seekedBy: req.user.transform().id,
    userID: user._id,
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
      userID: req.params.userId,
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
    "Seseorang telah mengajukan request pengubahan data akun yang sudah ada, silahkan cek di sistem untuk menyetujui atau menolak request.";

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "[SI-YAPEMRI] APPROVAL BARU (UBAH DATA AKUN)",
    text: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    let offset, users, transformedUsers, totalRecords;

    if (!page && !limit) {
      users = await User.list({});
      transformedUsers = users.map((user) => user.transform());

      res.json({
        data: transformedUsers,
      });
    } else {
      offset = (page - 1) * limit;

      users = await User.list({ limit, offset });
      transformedUsers = users.map((user) => user.transform());

      totalRecords = await User.count();

      res.json({
        data: transformedUsers,
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
    const users = await User.filteredCount(filter);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Get download user list
 * @public
 */
exports.download = async (req, res, next) => {
  try {
    const params = req.query || {};
    const users = await User.listDownload(params);
    const transformedUsers = users.map((user) => user.transform());

    if (transformedUsers.length !== 0) {
      const opts = {};
      const transformOpts = {};
      const asyncOpts = {};
      const parser = new AsyncParser(opts, transformOpts, asyncOpts);
      const csv = await parser.parse(transformedUsers).promise();

      if (params.start && params.end) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' +
            `user_report_start_${new Date(
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
            `user_report_end_${new Date(params.end).toLocaleDateString()}.csv` +
            '"'
        );
      } else if (!params.end && params.start) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' +
            `user_report_start_${new Date(
              params.start
            ).toLocaleDateString()}.csv` +
            '"'
        );
      } else {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' + "user_report_all.csv" + '"'
        );
      }

      res.status(200).send(csv);
    } else if (transformedUsers.length === 0) {
      res.status(400).send();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (change status)
 * @public
 */
exports.remove = async (req, res, next) => {
  const updatedUser = omit({ ...req.body, status: "reviewed" });
  const user = Object.assign(req.locals.user, updatedUser);

  user
    .save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(User.checkDuplicateEmail(e)));

  const existingApproval = await approvalModel.findOne({
    seekedBy: req.user.transform().id,
    userID: user._id,
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
      userID: req.params.userId,
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
    "Seseorang telah mengajukan request penghapusan akun yang sudah ada, silahkan cek di sistem untuk menyetujui atau menolak request.";

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "[SI-YAPEMRI] APPROVAL BARU (HAPUS DATA AKUN)",
    text: emailContent,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Delete user (by deleting the data)
 * @public
 */
exports.hardRemove = (req, res, next) => {
  const { user } = req.locals;

  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
