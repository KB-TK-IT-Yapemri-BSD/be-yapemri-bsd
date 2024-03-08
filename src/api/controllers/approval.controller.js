const httpStatus = require("http-status");

const { omit } = require("lodash");

const Approval = require("../models/approval.model");
const Parent = require("../models/parent.model");
const Staff = require("../models/staff.model");
const User = require("../models/user.model");
const Student = require("../models/student.model");

const GeneratePagination = require("../utils/generatePagination");

/**
 * Load approval and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const approval = await Approval.get(id);
    req.locals = { approval };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get approval
 * @public
 */
exports.get = (req, res) => res.json(req.locals.approval.transform());

/**
 * Create new approval
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const { approvalBody } = req.body;
    const approval = new Approval(approvalBody);
    const savedApproval = await approval.save();
    res.status(httpStatus.CREATED);
    res.json(savedApproval.transform());
    next();
  } catch (error) {
    throw error;
  }
};

/**
 * Replace existing approval
 * @public
 */
exports.replace = async (req, res, next) => {
  const { approval } = req.locals;
  const newApproval = new Approval(req.body);
  const newApprovalObject = omit(newApproval.toObject(), "_id");

  await approval.updateOne(newApprovalObject, { override: true, upsert: true });
  const savedApproval = await Approval.findById(approval._id);

  res.json(savedApproval.transform());
};

/**
 * Update existing approval
 * @public
 */
exports.update = async (req, res, next) => {
  const updatedApproval = omit(req.body);
  const approval = Object.assign(req.locals.approval, updatedApproval);

  approval.save().then((savedApproval) => res.json(savedApproval.transform()));
};

/**
 * Get approval list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    let offset, approvals, transformedApprovals, totalRecords;

    if (!page && !limit) {
      approvals = await Approval.list({});
      transformedApprovals = approvals.map((approval) => approval.transform());

      res.json({
        data: transformedApprovals,
      });
    } else {
      offset = (page - 1) * limit;

      approvals = await Approval.list({ limit, offset });
      transformedApprovals = approvals.map((approval) => approval.transform());

      const totalRecords = await Approval.count();

      res.json({
        data: transformedApprovals,
        pagination: GeneratePagination(limit, page, totalRecords),
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete approval
 * @public
 */
exports.remove = (req, res, next) => {
  const { approval } = req.locals;

  approval
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};

/**
 * Update existing approval (approve)
 * @public
 */
exports.approve = async (req, res, next) => {
  const updatedApproval = omit({
    ...req.body,
    status: "approved",
    approvedBy: req.user._id,
    rejectedBy: null,
  });
  const approval = Object.assign(req.locals.approval, updatedApproval);

  approval.save().then((savedApproval) => res.json(savedApproval.transform()));

  const checkIDAvailability = (approval) => {
    const updatedApproval = { ...approval };
    if (updatedApproval._doc.userID !== null) {
      updatedApproval._doc.changed = "Akun";
      updatedApproval._doc.changedID = updatedApproval._doc.userID;
    } else if (updatedApproval._doc.staffID !== null) {
      updatedApproval._doc.changed = "Staff";
      updatedApproval._doc.changedID = updatedApproval.staffID;
    } else if (updatedApproval._doc.studentID !== null) {
      updatedApproval._doc.changed = "Murid";
      updatedApproval._doc.changedID = updatedApproval.studentID;
    } else if (updatedApproval._doc.parentID !== null) {
      updatedApproval._doc.changed = "Wali Murid";
      updatedApproval._doc.changedID = updatedApproval.parentID;
    }

    return updatedApproval._doc;
  };
  let checkedApproval = checkIDAvailability(approval);

  switch (checkedApproval.changed) {
    case "Akun":
      if (checkedApproval.type === "add") {
        await User.updateOne(
          { _id: checkedApproval.userID },
          { status: "approved" }
        );
      } else if (checkedApproval.type === "edit") {
        await User.updateOne(
          { _id: checkedApproval.userID },
          { status: "approved" }
        );
      } else if (checkedApproval.type === "delete") {
        await User.findByIdAndDelete({ _id: checkedApproval.userID });
      }
      break;

    case "Staff":
      if (checkedApproval.type === "add") {
        await Staff.updateOne(
          { _id: checkedApproval.staffID },
          { status: "approved" }
        );
      } else if (checkedApproval.type === "edit") {
        await Staff.updateOne(
          { _id: checkedApproval.staffID },
          { status: "approved" }
        );
      } else if (checkedApproval.type === "delete") {
        await Staff.findByIdAndDelete({ _id: checkedApproval.staffID });
      }
      break;

    case "Murid":
      if (checkedApproval.type === "add") {
        await Student.updateOne(
          { _id: checkedApproval.studentID },
          { status: "approved" }
        );
      } else if (checkedApproval.type === "edit") {
        await Student.updateOne(
          { _id: checkedApproval.studentID },
          { status: "approved" }
        );
      } else if (checkedApproval.type === "delete") {
        await Student.findByIdAndDelete({ _id: checkedApproval.studentID });
      }
      break;

    case "Wali Murid":
      if (checkedApproval.type === "add") {
        await Parent.updateOne(
          { _id: checkedApproval.parentID },
          { status: "approved" }
        );
      } else if (checkedApproval.type === "edit") {
        await Parent.updateOne(
          { _id: checkedApproval.parentID },
          { status: "approved" }
        );
      } else if (checkedApproval.type === "delete") {
        await Parent.findByIdAndDelete({ _id: checkedApproval.parentID });
      }
      break;
  }
};

/**
 * Update existing approval (reject)
 * @public
 */
exports.reject = async (req, res, next) => {
  const updatedApproval = omit({
    ...req.body,
    status: "rejected",
    rejectedBy: req.user._id,
    approvedBy: null,
  });
  const approval = Object.assign(req.locals.approval, updatedApproval);

  approval.save().then((savedApproval) => res.json(savedApproval.transform()));

  const checkIDAvailability = (approval) => {
    const updatedApproval = { ...approval };
    if (updatedApproval._doc.userID !== null) {
      updatedApproval._doc.changed = "Akun";
      updatedApproval._doc.changedID = updatedApproval._doc.userID;
    } else if (updatedApproval._doc.staffID !== null) {
      updatedApproval._doc.changed = "Staff";
      updatedApproval._doc.changedID = updatedApproval.staffID;
    } else if (updatedApproval._doc.studentID !== null) {
      updatedApproval._doc.changed = "Murid";
      updatedApproval._doc.changedID = updatedApproval.studentID;
    } else if (updatedApproval._doc.parentID !== null) {
      updatedApproval._doc.changed = "Wali Murid";
      updatedApproval._doc.changedID = updatedApproval.parentID;
    }

    return updatedApproval._doc;
  };
  let checkedApproval = checkIDAvailability(approval);

  switch (checkedApproval.changed) {
    case "Akun":
      await User.updateOne(
        { _id: checkedApproval.userID },
        { status: "rejected" }
      );
      break;

    case "Staff":
      await Staff.updateOne(
        { _id: checkedApproval.staffID },
        { status: "rejected" }
      );
      break;

    case "Murid":
      await Student.updateOne(
        { _id: checkedApproval.studentID },
        { status: "rejected" }
      );
      break;

    case "Wali Murid":
      await Parent.updateOne(
        { _id: checkedApproval.parentID },
        { status: "rejected" }
      );
      break;
  }
};
