const httpStatus = require('http-status');
const Student = require('../models/student.model');

/**
 * Load student and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const student = await Student.get(id);
        req.locals = { student };
        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * Get student
 * @public
 */
exports.get = (req, res) => res.json(req.locals.student.transform());

/**
 * Create new student
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();
        res.status(httpStatus.CREATED);
        res.json(savedStudent.transform());
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { student } = req.locals;

        await student.updateOne(req.body);
        const savedStudent = await Student.findById(student._id);
        res.json(savedStudent.transform());
    } catch (error) {
        next((error));
    }
};

/**
 * Get student list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const students = await Student.list(req.query);
        const transformedStudents = students.map((student) => student.transform());
        res.json(transformedStudents);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete student
 * @public
 */
exports.remove = (req, res, next) => {
    const { student } = req.locals;

    student.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
