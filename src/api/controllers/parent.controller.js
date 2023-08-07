const { AsyncParser } = require('@json2csv/node');

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
 * Get count of each property
 * @public
 */
exports.count = async (req, res, next) => {
    try {
        const filter = req.query || {}
        const parents = await Parent.filteredCount(filter);
        res.json(parents)
    } catch (error) {
        next(error);
    }
};

/**
 * Get download parent list
 * @public
 */
exports.download = async (req, res, next) => {
    try {
        const params = req.query || {};
        const parents = await Parent.listDownload(params);
        const transformedParents = parents.map((parent) => parent.transform());

        if (transformedParents.length !== 0) {
            const opts = {};
            const transformOpts = {};
            const asyncOpts = {};
            const parser = new AsyncParser(opts, transformOpts, asyncOpts);
            const csv = await parser.parse(transformedParents).promise();

            if (params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `parent_report_start_${new Date(params.start).toLocaleDateString()}_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `parent_report_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.end && params.start) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `parent_report_start_${new Date(params.start).toLocaleDateString()}.csv` + '\"');
            } else {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'parent_report_all.csv' + '\"');
            }

            res.status(200).send(csv);
        } else if (transformedParents.length === 0) {
            res.status(400).send();
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Get father list
 * @public
 */
exports.listFathers = async (req, res, next) => {
    try {
        const parents = await Parent.listFathers(req.query);
        const transformedParents = parents.map((parent) => parent.transform());
        res.json(transformedParents);
    } catch (error) {
        next(error);
    }
};

/**
 * Get mother list
 * @public
 */
exports.listMothers = async (req, res, next) => {
    try {
        const parents = await Parent.listMothers(req.query);
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
