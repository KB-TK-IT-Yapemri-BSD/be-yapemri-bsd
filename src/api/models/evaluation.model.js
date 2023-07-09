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
    introduction: {
        type: String,
        required: true,
    },
    aspect_1: {
        type: String,
        required: true,
    },
    score_aspect_1: {
        type: String,
        required: true,
    },
    aspect_2: {
        type: String,
        required: true,
    },
    score_aspect_2: {
        type: String,
        required: true,
    },
    aspect_3: {
        type: String,
        required: true,
    },
    score_aspect_3: {
        type: String,
        required: true,
    },
    aspect_4: {
        type: String,
        required: true,
    },
    score_aspect_4: {
        type: String,
        required: true,
    },
    aspect_5: {
        type: String,
        required: true,
    },
    score_aspect_5: {
        type: String,
        required: true,
    },
    aspect_6: {
        type: String,
        required: true,
    },
    score_aspect_6: {
        type: String,
        required: true,
    },
    closing: {
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
            'student_id', 'grade', 'period',
            'introduction',
            'aspect_1', 'aspect_2', 'aspect_3', 'aspect_4', 'aspect_5', 'aspect_6',
            'score_aspect_1', 'score_aspect_2', 'score_aspect_3', 'score_aspect_4', 'score_aspect_5', 'score_aspect_6',
            'closing',
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
            .populate('student_id')
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    async listDownload({
        start,
        end,
        student_id, grade, period,
        score_aspect_1, score_aspect_2, score_aspect_3, score_aspect_4, score_aspect_5, score_aspect_6
    }) {
        let formData = {}

        if (student_id) {
            formData.student_id = student_id
        }

        if (grade) {
            formData.grade = grade
        }

        if (period) {
            formData.period = period
        }

        if (score_aspect_1) {
            formData.score_aspect_1 = score_aspect_1
        }

        if (score_aspect_2) {
            formData.score_aspect_2 = score_aspect_2
        }

        if (score_aspect_3) {
            formData.score_aspect_3 = score_aspect_3
        }

        if (score_aspect_4) {
            formData.score_aspect_4 = score_aspect_4
        }

        if (score_aspect_5) {
            formData.score_aspect_5 = score_aspect_5
        }

        if (score_aspect_6) {
            formData.score_aspect_6 = score_aspect_6
        }

        let result;

        if (start && end) {
            result = await this.find({
                createdAt: { $gte: new Date(start), $lte: new Date(end) },
                ...formData
            });
        } else if (!start && end) {
            result = await this.find({
                createdAt: { $lte: new Date(end) },
                ...formData
            });
        } else if (!end && start) {
            result = await this.find({
                createdAt: { $gte: new Date(start) },
                ...formData
            });
        } else {
            result = this.find({ ...formData });
        }

        return result;
    },
};

module.exports = mongoose.model('Evaluation', evaluationSchema);
