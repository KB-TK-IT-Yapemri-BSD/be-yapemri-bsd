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
 * Delete payment type
 * @public
 */
exports.remove = (req, res, next) => {
    const { paymentType } = req.locals;

    paymentType.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
