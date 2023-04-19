const httpStatus = require('http-status');
const Registration = require('../models/registration.model');

/**
 * Load form and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const registration = await Registration.get(id);
        req.locals = { registration };
        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * Get form
 * @public
 */
exports.get = (req, res) => res.json(req.locals.registration.transform());

/**
 * Create new form
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const registration = new Registration(req.body);
        const savedRegistration = await registration.save();
        res.status(httpStatus.CREATED);
        res.json(savedRegistration.transform());
    } catch (error) {
        next(error);
    }
};

/**
 * Get form list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const registrations = await Registration.list(req.query);
        const transformedForms = registrations.map((registration) => registration.transform());
        res.json(transformedForms);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete form
 * @public
 */
exports.remove = (req, res, next) => {
    const { registration } = req.locals;

    registration.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
