const { AsyncParser } = require('@json2csv/node');

const httpStatus = require('http-status');
const Evaluation = require('../models/evaluation.model')

/**
 * Load evaluation and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const evaluation = await Evaluation.get(id);
        req.locals = { evaluation };
        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * Get evaluation
 * @public
 */
exports.get = (req, res) => res.json(req.locals.evaluation.transform());

/**
 * Create new evaluation
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const evaluation = new Evaluation(req.body);
        const savedEvaluation = await evaluation.save();
        res.status(httpStatus.CREATED);
        res.json(savedEvaluation.transform());
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { evaluation } = req.locals;

        await evaluation.updateOne(req.body);
        const savedEvaluation = await Evaluation.findById(evaluation._id);
        res.json(savedEvaluation.transform());
    } catch (error) {
        next((error));
    }
};

/**
 * Get evaluation list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const evaluations = await Evaluation.list(req.query);
        const transformedEvaluations = evaluations.map((evaluation) => evaluation.transform());
        res.json(transformedEvaluations);
    } catch (error) {
        next(error);
    }
};

/**
 * Get download evaluation list
 * @public
 */
exports.download = async (req, res, next) => {
    try {
        const params = req.query || {};
        const evaluations = await Evaluation.listDownload(params);
        const transformedEvaluations = evaluations.map((evaluation) => evaluation.transform());

        if (transformedEvaluations.length !== 0) {
            const opts = {};
            const transformOpts = {};
            const asyncOpts = {};
            const parser = new AsyncParser(opts, transformOpts, asyncOpts);
            const csv = await parser.parse(transformedEvaluations).promise();

            if (params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `evaluation_report_start_${new Date(params.start).toLocaleDateString()}_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.start && params.end) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `evaluation_report_end_${new Date(params.end).toLocaleDateString()}.csv` + '\"');
            } else if (!params.end && params.start) {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + `evaluation_report_start_${new Date(params.start).toLocaleDateString()}.csv` + '\"');
            } else {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'evaluation_report_all.csv' + '\"');
            }

            res.status(200).send(csv);
        } else if (transformedEvaluations.length === 0) {
            res.status(400).send();
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Delete evaluation
 * @public
 */
exports.remove = (req, res, next) => {
    const { evaluation } = req.locals;

    evaluation.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
