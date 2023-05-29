const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const Parent = require('./parent.model');

/**
 * gender = {
 *    female: true,
 *    male: false,
 * }
 */

/**
 * Student Schema
 * @private
 */
const studentSchema = new mongoose.Schema({
    grade: {
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
    picture: {
        type: String,
        required: false,
        default: '',
    },
    address: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    birthOrder: {
        type: Number,
        required: true,
    },
    numOfSiblings: {
        type: Number,
        required: true,
    },
    statusInFamily: {
        type: String,
        required: true,
    },
    studentStatus: {
        type: String,
        required: false,
        default: true,
    },
    height: {
        type: Number,
        required: true,
        default: 0,
    },
    weight: {
        type: Number,
        required: true,
        default: 0,
    },
    bloodType: {
        type: String,
        required: true,
        maxLength: 2,
    },
    diseaseHistory: {
        type: String,
        required: false,
        default: '',
    },
    distanceToHome: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    mother_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: '',
        ref: Parent,
    },
    father_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: '',
        ref: Parent,
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
studentSchema.method({
    transform() {
        const transformed = {};
        const fields = [
            'id',
            'grade', 'firstName', 'lastName', 'birthplace', 'birthdate', 'gender', 'religion', 'citizenship', 'picture', 'address',
            'nickname', 'birthOrder', 'numOfSiblings', 'statusInFamily', 'studentStatus', 'height', 'weight', 'bloodType', 'diseaseHistory', 'distanceToHome', 'language',
            'mother_id', 'father_id',
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
studentSchema.statics = {
    /**
     * Get students.
     *
     * @param {ObjectId} id - The objectId of student.
     * @returns {Promise<Student, APIError>}
     */
    async get(id) {
        let student;

        if (mongoose.Types.ObjectId.isValid(id)) {
            student = await this.findById(id)
                .populate('mother_id')
                .populate('father_id')
                .exec();
        }
        if (student) {
            return student;
        }

        throw new APIError({
            message: 'Student does not exist',
            status: httpStatus.NOT_FOUND,
        });
    },

    /**
     * List of students in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of students to be skipped.
     * @param {number} limit - Limit number of students to be returned.
     * @returns {Promise<Student[]>}
     */
    list({
        page = 1,
        perPage = 30,
    }) {
        return this.find()
            .populate('father_id')
            .populate('mother_id')
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },
};

module.exports = mongoose.model('Student', studentSchema);
