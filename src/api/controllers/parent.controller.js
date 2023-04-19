const httpStatus = require('http-status');
const Parent = require('../models/parent.model');

/**
 * Load parent and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const parent = await Parent.get(id);
        req.locals = { parent };
        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * Get parent
 * @public
 */
exports.get = (req, res) => res.json(req.locals.parent.transform());

/**
 * Create new parent
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const parent = new Parent(req.body);
        const savedParent = await parent.save();
        res.status(httpStatus.CREATED);
        res.json(savedParent.transform());
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { parent } = req.locals;

        await parent.updateOne(req.body);
        const savedParent = await Parent.findById(parent._id);
        res.json(savedParent.transform());
    } catch (error) {
        next((error));
    }
};

/**
 * Get parent list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const parents = await Parent.list(req.query);
        const transformedParents = parents.map((parent) => parent.transform());
        res.json(transformedParents);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete parent
 * @public
 */
exports.remove = (req, res, next) => {
    const { parent } = req.locals;

    parent.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
