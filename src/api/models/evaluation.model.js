const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const Student = require('./student.model');

/**
 * Evaluation Schema
 * @private
 */
const evaluationSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: '',
        ref: Student,
    },
    grade: {
        type: String,
        required: true,
    },
    period: {
        type: String,
        required: true,
    },
    score: {
        type: String,
        required: true,
    },
    description: {
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
evaluationSchema.method({
    transform() {
        const transformed = {};
        const fields = [
            'id',
            'student_id', 'grade', 'period', 'score', 'description',
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
evaluationSchema.statics = {
    /**
     * Get evaluation.
     *
     * @param {ObjectId} id - The objectId of evaluation.
     * @returns {Promise<Evaluation, APIError>}
     */
    async get(id) {
        let evaluation;

        if (mongoose.Types.ObjectId.isValid(id)) {
            evaluation = await this.findById(id)
                .populate('student_id')
                .exec();
        }
        if (evaluation) {
            return evaluation;
        }

        throw new APIError({
            message: 'The evaluation data does not exist',
            status: httpStatus.NOT_FOUND,
        });
    },

    /**
     * List of evaluations in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of evaluations to be skipped.
     * @param {number} limit - Limit number of evaluations to be returned.
     * @returns {Promise<Evaluation[]>}
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

module.exports = mongoose.model('Evaluation', evaluationSchema);
