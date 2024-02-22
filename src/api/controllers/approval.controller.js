const { AsyncParser } = require("@json2csv/node");

const httpStatus = require("http-status");
const { omit } = require("lodash");
const Approval = require("../models/approval.model");

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
    const approval = new Approval(req.body);
    const savedApproval = await approval.save();
    res.status(httpStatus.CREATED);
    res.json(savedApproval.transform());
    next();
  } catch (error) {
    next(Approval.checkDuplicateEmail(error));
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

  approval
    .save()
    .then((savedApproval) => res.json(savedApproval.transform()))
    .catch((e) => next(Approval.checkDuplicateEmail(e)));
};

/**
 * Get approval list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const approvals = await Approval.list(req.query);
    const transformedApprovals = approvals.map((approval) =>
      approval.transform()
    );
    res.json(transformedApprovals);
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
