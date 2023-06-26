const { AsyncParser } = require('@json2csv/node');

const httpStatus = require('http-status');
const Staff = require('../models/staff.model');

/**
 * Load staff and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const staff = await Staff.get(id);
        req.locals = { staff };
        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * Get staff
 * @public
 */
exports.get = (req, res) => res.json(req.locals.staff.transform());

/**
 * Create new staff
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const staff = new Staff(req.body);
        const savedStaff = await staff.save();
        res.status(httpStatus.CREATED);
        res.json(savedStaff.transform());
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { staff } = req.locals;

        await staff.updateOne(req.body);
        const savedStaff = await Staff.findById(staff._id);
        res.json(savedStaff.transform());
    } catch (error) {
        next((error));
    }
};

/**
 * Get staff list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const staffs = await Staff.list(req.query);
        const transformedStaffs = staffs.map((staff) => staff.transform());
        res.json(transformedStaffs);
    } catch (error) {
        next(error);
    }
};

/**
 * Get download staff list
 * @public
 */
exports.download = async (req, res, next) => {
    try {
        const params = req.query || {};
        const staffs = await Staff.listDownload(params);
        const transformedStaffs = staffs.map((staff) => staff.transform());

        if (transformedStaffs.length !== 0) {
            const opts = {};
            const transformOpts = {};
            const asyncOpts = {};
            const parser = new AsyncParser(opts, transformOpts, asyncOpts);
            const csv = await parser.parse(transformedStaffs).promise();

            if (params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `staff_report_start_${new Date(params.start).toLocaleDateString()}_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `staff_report_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.end && params.start) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `staff_report_start_${new Date(params.start).toLocaleDateString()}.csv` + '\"');
            } else {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'staff_report_all.csv' + '\"');
            }

            res.status(200).send(csv);
        } else if (transformedStaffs.length === 0) {
            res.status(400).send();
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Delete staff
 * @public
 */
exports.remove = (req, res, next) => {
    const { staff } = req.locals;

    staff.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
