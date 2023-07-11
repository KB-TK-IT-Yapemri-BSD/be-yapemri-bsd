const { AsyncParser } = require('@json2csv/node');

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
 * Get student count
 * @public
 */
exports.dashboard = async (req, res, next) => {
    try {
        const students = await Student.formCount();
        res.json(students)
        {/**
        const transformedForms = registrations.map((registration) => registration.transform());
        res.json(transformedForms);
         */}
    } catch (error) {
        next(error);
    }
};

/**
 * Get count of each property
 * @public
 */
exports.count = async (req, res, next) => {
    try {
        const filter = req.query || {}
        const students = await Student.filteredCount(filter);
        res.json(students)
        {/**
        const transformedForms = registrations.map((registration) => registration.transform());
        res.json(transformedForms);
         */}
    } catch (error) {
        next(error);
    }
};

/**
 * Get download student list
 * @public
 */
exports.download = async (req, res, next) => {
    try {
        const params = req.query || {};
        const students = await Student.listDownload(params);
        const transformedStudents = students.map((student) => student.transform());

        if (transformedStudents.length !== 0) {
            const opts = {};
            const transformOpts = {};
            const asyncOpts = {};
            const parser = new AsyncParser(opts, transformOpts, asyncOpts);
            const csv = await parser.parse(transformedStudents).promise();

            if (params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `student_report_start_${new Date(params.start).toLocaleDateString()}_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `student_report_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.end && params.start) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `student_report_start_${new Date(params.start).toLocaleDateString()}.csv` + '\"');
            } else {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'student_report_all.csv' + '\"');
            }

            res.status(200).send(csv);
        } else if (transformedStudents.length === 0) {
            res.status(400).send();
        }
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
