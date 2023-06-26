const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

/**
 * gender = {
 *    female: true,
 *    male: false,
 * }
 */

/**
 * Staff Schema
 * @private
 */
const staffSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
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
}, {
    timestamps: true,
});

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
            'id',
            'status', 'firstName', 'lastName', 'birthplace', 'birthdate', 'gender', 'religion', 'citizenship', 'address', 'phone', 'education',
            'createdAt', 'updatedAt',
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
            staff = await this.findById(id)
                .populate('biodata_id')
                .exec();
        }
        if (staff) {
            return staff;
        }

        throw new APIError({
            message: 'The staff data does not exist',
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
    list({
        page = 1,
        perPage = 30,
    }) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    async listDownload({
        start,
        end,
    }) {
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
            result = this.find();
        }
        return result;
    },
};

module.exports = mongoose.model('Staff', staffSchema);
