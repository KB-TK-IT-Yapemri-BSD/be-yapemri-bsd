const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../errors/api-error");
const { status } = require("./user.model");

/**
 * gender = {
 *    female: true,
 *    male: false,
 * }
 */

const dataStatus = ["requested", "edited", "approved", "rejected", "reviewed"];

/**
 * Staff Schema
 * @private
 */
const staffSchema = new mongoose.Schema(
  {
    status: {
      // employee status
      type: String,
      required: true,
    },
    dataStatus: {
      // data status
      type: String,
      required: false,
      default: "requested",
      enum: dataStatus,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthplace: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    gender: {
      type: Boolean,
      required: true,
    },
    religion: {
      type: String,
      required: true,
    },
    citizenship: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Add your-
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
staffSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "status",
      "dataStatus",
      "firstName",
      "lastName",
      "birthplace",
      "birthdate",
      "gender",
      "religion",
      "citizenship",
      "address",
      "phone",
      "education",
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
staffSchema.statics = {
  /**
   * Get staffs.
   *
   * @param {ObjectId} id - The objectId of staff.
   * @returns {Promise<Staff, APIError>}
   */
  async get(id) {
    let staff;

    if (mongoose.Types.ObjectId.isValid(id)) {
      staff = await this.findById(id).populate("biodata_id").exec();
    }
    if (staff) {
      return staff;
    }

    throw new APIError({
      message: "The staff data does not exist",
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * List of staffs in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of staffs to be skipped.
   * @param {number} limit - Limit number of staffs to be returned.
   * @returns {Promise<Staff[]>}
   */
  list(payload) {
    const { limit, offset, ...queryOptions } = payload;

    const options = { ...queryOptions };

    if (!limit && !offset) {
      return this.find(options).sort({ createdAt: -1 }).exec();
    } else {
      return this.find(options)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec();
    }
  },

  async listDownload({ start, end, gender, religion, citizenship }) {
    let formData = {};

    if (gender) {
      formData.gender = gender;
    }

    if (religion) {
      formData.religion = religion;
    }

    if (citizenship) {
      formData.citizenship = citizenship;
    }

    let result;
    if (start && end) {
      result = await this.find({
        createdAt: { $gte: new Date(start), $lte: new Date(end) },
        ...formData,
      });
    } else if (!start && end) {
      result = await this.find({
        createdAt: { $lte: new Date(end) },
        ...formData,
      });
    } else if (!end && start) {
      result = await this.find({
        createdAt: { $gte: new Date(start) },
        ...formData,
      });
    } else {
      result = this.find({ ...formData });
    }

    return result;
  },

  async filteredCount({ start, end, type }) {
    let result;

    if (start && end) {
      result = await this.find({
        createdAt: { $gte: new Date(start), $lte: new Date(end) },
      });
    } else if (!start && end) {
      result = await this.find({
        createdAt: { $lte: new Date(end) },
      });
    } else if (!end && start) {
      result = await this.find({
        createdAt: { $gte: new Date(start) },
      });
    } else {
      result = await this.find();
    }

    const values = [...new Set(result.map((item) => item[type]))];

    const valueCounts = {};
    result.forEach((item) => {
      const value = item[type];
      if (value !== undefined) {
        if (valueCounts[value]) {
          valueCounts[value]++;
        } else {
          valueCounts[value] = 1;
        }
      }
    });

    const chartData = values.map((value) => ({
      value,
      count: valueCounts[value] || 0,
    }));

    return chartData;
  },
};

module.exports = mongoose.model("Staff", staffSchema);
