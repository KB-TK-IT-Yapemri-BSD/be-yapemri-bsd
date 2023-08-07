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
        const fields = ['id', 'user_id', 'type_id', 'amount', 'status', 'payment_date', 'receipt', 'isOverdue', 'modified', 'reason', 'createdAt', 'updatedAt'];

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
        status,
        isOverdue,
        modified,
    }) {
        let formData = {}

        if (user_id) {
            formData.user_id = user_id
        }

        if (type_id) {
            formData.type_id = type_id
        }

        if (payment_date) {
            formData.payment_date = payment_date
        }

        if (status) {
            formData.status = status
        }

        if (isOverdue) {
            formData.isOverdue = isOverdue
        }

        if (modified) {
            formData.modified = modified
        }

        let result;

        if (start && end) {
            result = await this.find({
                payment_date: { $gte: new Date(start), $lte: new Date(end) },
                ...formData
            });
        } else if (!start && end) {
            result = await this.find({
                payment_date: { $lte: new Date(end) },
                ...formData
            });
        } else if (!end && start) {
            result = await this.find({
                payment_date: { $gte: new Date(start) },
                ...formData
            });
        } else {
            result = this.find({ ...formData });
        }

        return result;
    },

    async filteredCount({
        start, end, type
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
            result = await this.find();
        }

        const values = [...new Set(result.map(item => item[type]))];

        const valueCounts = {};
        result.forEach(item => {
            const value = item[type];
            if (value !== undefined) {
                if (valueCounts[value]) {
                    valueCounts[value]++;
                } else {
                    valueCounts[value] = 1;
                }
            }
        });

        const chartData = values.map(value => ({
            value,
            count: valueCounts[value] || 0
        }));

        return chartData;
    },
};

/**
 * @typedef Payment
 */
module.exports = mongoose.model('Payment', paymentSchema);
