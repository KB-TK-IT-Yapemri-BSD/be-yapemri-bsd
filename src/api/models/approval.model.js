const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../errors/api-error");

const Staff = require("./staff.model");
const Student = require("./student.model");
const Parent = require("./parent.model");
const User = require("./user.model");

/**
 * Approval Schema
 * @private
 */
const approvalSchema = new mongoose.Schema(
  {
    seekedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: User,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: User,
    },
    type: {
      type: String,
      required: true,
      enum: ["add", "edit", "delete"],
    },
    status: {
      type: String,
      required: false,
      enum: ["requested", "edited", "reviewed", "approved", "rejected"],
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: User,
    },
    staffID: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: Staff,
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: Student,
    },
    parentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: Parent,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
approvalSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "seekedBy",
      "approvedBy",
      "rejectedBy",
      "type",
      "status",
      "userID",
      "staffID",
      "studentID",
      "parentID",
      "createdAt",
      "updatedAt",
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
approvalSchema.statics = {
  /**
   * Get approvals.
   *
   * @param {ObjectId} id - The objectId of approval.
   * @returns {Promise<Student, APIError>}
   */
  async get(id) {
    let approval;

    if (mongoose.Types.ObjectId.isValid(id)) {
      approval = await this.findById(id)
        .populate({
          path: "seekedBy",
          populate: {
            path: "biodata_id",
          },
        })
        .populate({
          path: "approvedBy",
          populate: {
            path: "biodata_id",
          },
        })
        .populate({
          path: "rejectedBy",
          populate: {
            path: "biodata_id",
          },
        })
        .exec();
    }
    if (approval) {
      return approval;
    }

    throw new APIError({
      message: "Approval does not exist",
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * List of approvals in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of approvals to be skipped.
   * @param {number} limit - Limit number of approvals to be returned.
   * @returns {Promise<Approval[]>}
   */
  list(payload) {
    const { limit, offset, ...queryOptions } = payload;

    const options = { ...queryOptions };

    if (!limit && !offset) {
      return this.find(options)
        .populate({
          path: "seekedBy",
          populate: {
            path: "biodata_id",
          },
        })
        .populate({
          path: "approvedBy",
          populate: {
            path: "biodata_id",
          },
        })
        .populate({
          path: "rejectedBy",
          populate: {
            path: "biodata_id",
          },
        })
        .sort({ createdAt: -1 })
        .exec();
    } else {
      return this.find(options)
        .populate({
          path: "seekedBy",
          populate: {
            path: "biodata_id",
          },
        })
        .populate({
          path: "approvedBy",
          populate: {
            path: "biodata_id",
          },
        })
        .populate({
          path: "rejectedBy",
          populate: {
            path: "biodata_id",
          },
        })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec();
    }
  },
};

module.exports = mongoose.model("Approval", approvalSchema);
