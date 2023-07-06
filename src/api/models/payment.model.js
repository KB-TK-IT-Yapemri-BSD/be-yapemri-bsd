const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

const PaymentType = require('./paymentType.model');
const Student = require('./student.model');

/**
 * status = {
 *    null,
 *    pending: false,
 *    paid: true
 * }
 */

/**
 * Payment Schema
 * @private
 */
const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: Student,
    },
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: PaymentType,
    },
    payment_date: {
        type: Date,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    status: {
        type: Boolean,
        required: false,
        default: false,
    },
    receipt: {
        type: String,
        required: false,
        default: '',
    },
    isOverdue: {
        type: String,
        required: false,
        default: '',
    },
    modified: {
        type: Boolean,
        required: false,
        default: false,
    },
    reason: {
        type: String,
        required: false,
        default: ''
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
paymentSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'user_id', 'type_id', 'deadline', 'amount', 'status', 'payment_date', 'receipt', 'isOverdue', 'modified', 'reason', 'createdAt', 'updatedAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});

/**
 * Statics
 */
paymentSchema.statics = {

    /**
     * Get payments.
     *
     * @param {ObjectId} id - The objectId of payment.
     * @returns {Promise<Payment, APIError>}
     */
    async get(id) {
        let payment;

        if (mongoose.Types.ObjectId.isValid(id)) {
            payment = await this.findById(id)
                .populate('user_id')
                .populate('type_id')
                .exec();
        }
        if (payment) {
            return payment;
        }

        throw new APIError({
            message: 'Payment does not exist',
            status: httpStatus.NOT_FOUND,
        });
    },

    /**
     * List of payments in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of payments to be skipped.
     * @param {number} limit - Limit number of payments to be returned.
     * @returns {Promise<Payment[]>}
     */
    list({
        page,
        perPage,
    }) {
        return this.find()
            .populate('user_id')
            .populate('type_id')
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    /**
     * List of payments in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of payments to be skipped.
     * @param {number} limit - Limit number of payments to be returned.
     * @returns {Promise<Payment[]>}
     */
    filter({
        status,
        page,
        perPage,
    }) {
        return this.find({ status })
            .populate('user_id')
            .populate('type_id')
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    async listDownload({
        start,
        end,
        user_id,
        type_id,
        payment_date,
        amount,
        status,
        isOverdue,
        modified,
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
 * @typedef Payment
 */
module.exports = mongoose.model('Payment', paymentSchema);
