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
 * Parent Schema
 * @private
 */
const parentSchema = new mongoose.Schema({
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
    occupation: {
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
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
parentSchema.method({
    transform() {
        const transformed = {};
        const fields = [
            'id',
            'status', 'firstName', 'lastName', 'birthplace', 'birthdate', 'gender', 'religion', 'citizenship', 'address', 'phone', 'occupation', 'education',
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
parentSchema.statics = {
    /**
     * Get parents.
     *
     * @param {ObjectId} id - The objectId of parent.
     * @returns {Promise<Parent, APIError>}
     */
    async get(id) {
        let parent;

        if (mongoose.Types.ObjectId.isValid(id)) {
            parent = await this.findById(id)
                .exec();
        }
        if (parent) {
            return parent;
        }

        throw new APIError({
            message: 'The parent data does not exist',
            status: httpStatus.NOT_FOUND,
        });
    },

    /**
     * List of parents in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of parents to be skipped.
     * @param {number} limit - Limit number of parents to be returned.
     * @returns {Promise<Parent[]>}
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
};

module.exports = mongoose.model('Parent', parentSchema);
