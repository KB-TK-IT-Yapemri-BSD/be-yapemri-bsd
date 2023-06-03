const httpStatus = require('http-status');
const Payment = require('../models/payment.model');

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
        const { payment } = req.locals;

        await payment.updateOne(req.body);
        const savedPayment = await Payment.findById(payment._id);
        res.json(savedPayment.transform());
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
        const payments = await Payment.find(req.query).populate('user_id').populate('type_id');
        const transformedPayments = payments.map((payment) => payment.transform());
        res.json(transformedPayments);
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
