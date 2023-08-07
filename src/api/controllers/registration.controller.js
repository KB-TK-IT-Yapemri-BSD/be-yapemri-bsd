const { AsyncParser } = require('@json2csv/node');

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
 * Get count of each property
 * @public
 */
exports.count = async (req, res, next) => {
    try {
        const filter = req.query || {}
        const registrations = await Registration.filteredCount(filter);
        res.json(registrations)
    } catch (error) {
        next(error);
    }
};

/**
 * Get form count
 * @public
 */
exports.dashboard = async (req, res, next) => {
    try {
        const registrations = await Registration.formCount();
        res.json(registrations)
        {/**
        const transformedForms = registrations.map((registration) => registration.transform());
        res.json(transformedForms);
         */}
    } catch (error) {
        next(error);
    }
};

/**
 * Get download form list
 * @public
 */
exports.download = async (req, res, next) => {
    try {
        const params = req.query || {};
        const forms = await Registration.listDownload(params);
        const transformedRegistrations = forms.map((form) => form.transform());

        if (transformedRegistrations.length !== 0) {
            const opts = {};
            const transformOpts = {};
            const asyncOpts = {};
            const parser = new AsyncParser(opts, transformOpts, asyncOpts);
            const csv = await parser.parse(transformedRegistrations).promise();

            if (params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `form_report_start_${new Date(params.start).toLocaleDateString()}_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `form_report_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.end && params.start) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `form_report_start_${new Date(params.start).toLocaleDateString()}.csv` + '\"');
            } else {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'form_report_all.csv' + '\"');
            }

            res.status(200).send(csv);
        } else if (transformedRegistrations.length === 0) {
            res.status(400).send();
        }
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
