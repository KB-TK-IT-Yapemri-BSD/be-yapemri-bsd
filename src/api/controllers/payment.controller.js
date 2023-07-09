const { AsyncParser } = require('@json2csv/node');

const httpStatus = require('http-status');
const { omit } = require('lodash');
const Payment = require('../models/payment.model');
const { handleFileUploadReceipt } = require('../../config/cloudinary');

/**
 * Load payments and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const payment = await Payment.get(id);
        req.locals = { payment };
        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * Get payment
 * @public
 */
exports.get = (req, res) => res.json(req.locals.payment.transform());

/**
 * Create new payment
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const payment = new Payment(req.body);
        const savedPayment = await payment.save();
        res.status(httpStatus.CREATED);
        res.json(savedPayment.transform());
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        let receiptUploaded = ''

        if (req.file) {
            receiptUploaded = await handleFileUploadReceipt(req.file.path);
        }

        const updatedPayment = omit({ ...req.body, receipt: receiptUploaded });
        const payment = Object.assign(req.locals.payment, updatedPayment);

        payment.save()
            .then((savedPayment) => res.json(savedPayment.transform()))
            .catch((e) => next(e));

        const savedPayment = await Payment.findById(payment._id);
        res.json(savedPayment.transform());
    } catch (error) {
        next((error));
    }
};

exports.updating = async (req, res, next) => {
    try {
        const receiptUploaded = await handleFileUpload(req.file.path);

        const data = await Payment.findOneAndUpdate({ _id: req.params.paymentId },
            { receipt: receiptUploaded }, { new: true });

        res.status(200).json({ data });
    } catch (error) {
        next((error));
    }
};

/**
 * Get payments list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const payments = await Payment.list(req.query);
        const transformedPayments = payments.map((payment) => payment.transform());
        res.json(transformedPayments);
    } catch (error) {
        next(error);
    }
};

/**
 * Get payments list
 * @public
 */
exports.filter = async (req, res, next) => {
    try {
        const filter = req.query || {}
        const payments = await Payment.find(filter).populate('user_id').populate('type_id');
        const transformedPayments = payments.map((payment) => payment.transform());
        res.json(transformedPayments);
    } catch (error) {
        next(error);
    }
};

/**
 * Get download payment list
 * @public
 */
exports.download = async (req, res, next) => {
    try {
        const params = req.query || {};
        const payments = await Payment.listDownload(params);
        const transformedPayments = payments.map((payment) => payment.transform());

        if (transformedPayments.length !== 0) {
            const opts = {};
            const transformOpts = {};
            const asyncOpts = {};
            const parser = new AsyncParser(opts, transformOpts, asyncOpts);
            const csv = await parser.parse(transformedPayments).promise();

            if (params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `payment_report_start_${new Date(params.start).toLocaleDateString()}_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `payment_report_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.end && params.start) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `payment_report_start_${new Date(params.start).toLocaleDateString()}.csv` + '\"');
            } else {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'payment_report_all.csv' + '\"');
            }

            res.status(200).send(csv);
        } else if (transformedPayments.length === 0) {
            res.status(400).send();
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Delete payment
 * @public
 */
exports.remove = (req, res, next) => {
    const { payment } = req.locals;

    payment.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
