const { AsyncParser } = require('@json2csv/node');

const httpStatus = require('http-status');
const PaymentType = require('../models/paymentType.model');

/**
 * Load payment types and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const paymentType = await PaymentType.get(id);
        req.locals = { paymentType };
        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * Get payment type
 * @public
 */
exports.get = (req, res) => res.json(req.locals.paymentType.transform());

/**
 * Create new payment type
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const paymentType = new PaymentType(req.body);
        const savedPaymentType = await paymentType.save();
        res.status(httpStatus.CREATED);
        res.json(savedPaymentType.transform());
    } catch (error) {
        next(error);
    }
};

/**
 * Get payment types data list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const paymentTypes = await PaymentType.list(req.query);
        const transformedPaymentTypes = paymentTypes.map((paymentType) => paymentType.transform());
        res.json(transformedPaymentTypes);
    } catch (error) {
        next(error);
    }
};

/**
 * Get download payment type list
 * @public
 */
exports.download = async (req, res, next) => {
    try {
        const params = req.query || {};
        const paymentTypes = await PaymentType.listDownload(params);
        const transformedPaymentTypes = paymentTypes.map((paymentType) => paymentType.transform());

        if (transformedPaymentTypes.length !== 0) {
            const opts = {};
            const transformOpts = {};
            const asyncOpts = {};
            const parser = new AsyncParser(opts, transformOpts, asyncOpts);
            const csv = await parser.parse(transformedPaymentTypes).promise();

            if (params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `paymentType_report_start_${new Date(params.start).toLocaleDateString()}_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `paymentType_report_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.end && params.start) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `paymentType_report_start_${new Date(params.start).toLocaleDateString()}.csv` + '\"');
            } else {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'paymentType_report_all.csv' + '\"');
            }

            res.status(200).send(csv);
        } else if (transformedPaymentTypes.length === 0) {
            res.status(400).send();
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Delete payment type
 * @public
 */
exports.remove = (req, res, next) => {
    const { paymentType } = req.locals;

    paymentType.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
