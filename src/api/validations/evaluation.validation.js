const Joi = require('joi');

module.exports = {

    // GET /v1/evaluations
    listEvaluations: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            student_id: Joi.string(),
            grade: Joi.string(),
            period: Joi.string(),
            score: Joi.string(),
            description: Joi.string(),
        },
    },

    // POST /v1/evaluations
    createEvaluation: {
        body: {
            student_id: Joi.string(),
            grade: Joi.string(),
            period: Joi.string(),
            score: Joi.string(),
            description: Joi.string(),
        },
    },

    // PATCH /v1/evaluations/:evaluationId
    updateEvaluation: {
        body: {
            student_id: Joi.string(),
            grade: Joi.string(),
            period: Joi.string(),
            score: Joi.string(),
            description: Joi.string(),
        },
    },
};
