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
 * Delete staff
 * @public
 */
exports.remove = (req, res, next) => {
    const { staff } = req.locals;

    staff.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
