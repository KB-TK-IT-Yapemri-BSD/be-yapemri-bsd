const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../errors/api-error");

/**
 * Approval Schema
 * @private
 */
const approvalSchema = new mongoose.Schema(
  {
    seekedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
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
    },
    staffID: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    parentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    gradeID: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
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
      "type",
      "status",
      "userID",
      "staffID",
      "studentID",
      "parentID",
      "gradeID",
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
      approval = await this.findById(id).exec();
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
   * @returns {Promise<Student[]>}
   */
  list({ page = 1, perPage = 30 }) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model("Approval", approvalSchema);
