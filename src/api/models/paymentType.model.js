const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

/**
 * Payment Type Schema
 * @private
 */
const paymentTypeSchema = new mongoose.Schema({
    type: {
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
paymentTypeSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'type', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});

/**
 * Statics
 */
paymentTypeSchema.statics = {

    /**
     * Get payment types.
     *
     * @param {ObjectId} id - The objectId of the payment type.
     * @returns {Promise<PaymentType, APIError>}
     */
    async get(id) {
        let paymentType;

        if (mongoose.Types.ObjectId.isValid(id)) {
            paymentType = await this.findById(id).exec();
        }
        if (paymentType) {
            return paymentType;
        }

        throw new APIError({
            message: 'The payment type does not exist',
            status: httpStatus.NOT_FOUND,
        });
    },

    /**
     * List of payment types in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of payment types to be skipped.
     * @param {number} limit - Limit number of payment types to be returned.
     * @returns {Promise<PaymentType[]>}
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
};

/**
 * @typedef PaymentType
 */
module.exports = mongoose.model('PaymentType', paymentTypeSchema);
