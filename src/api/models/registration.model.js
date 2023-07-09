const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

/**
 * Registration Form Schema
 * @private
 */
const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    numChildrens: {
        type: Number,
        required: true,
    },
    ageChildrens: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
registrationSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'email', 'phone', 'address', 'numChildrens', 'ageChildrens', 'grade', 'reason', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});

/**
 * Statics
 */
registrationSchema.statics = {

    /**
     * Get form.
     *
     * @param {ObjectId} id - The objectId of form.
     * @returns {Promise<Registration, APIError>}
     */
    async get(id) {
        let registration;

        if (mongoose.Types.ObjectId.isValid(id)) {
            registration = await this.findById(id).exec();
        }
        if (registration) {
            return registration;
        }

        throw new APIError({
            message: 'Registration Form does not exist',
            status: httpStatus.NOT_FOUND,
        });
    },

    /**
     * List forms in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of forms to be skipped.
     * @param {number} limit - Limit number of forms to be returned.
     * @returns {Promise<Registration[]>}
     */
    list({
        page = 1, perPage = 30,
    }) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    async formCount() {
        const dateNow = new Date();
        const threeYearsBefore = new Date();
        threeYearsBefore.setFullYear(threeYearsBefore.getFullYear() - 3);

        const forms = await this.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: threeYearsBefore,
                        $lte: dateNow,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    count: 1,
                },
            },
            {
                $sort: {
                    year: -1,
                },
            },
        ]);

        return forms;
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

/**
 * @typedef Registration
 */
module.exports = mongoose.model('Registration', registrationSchema);
