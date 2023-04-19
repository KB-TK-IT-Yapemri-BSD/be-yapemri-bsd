const Joi = require('joi');

module.exports = {

    // GET /v1/forms
    listForms: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string(),
            address: Joi.string(),
            numChildrens: Joi.number(),
            ageChildrens: Joi.string(),
            level: Joi.string(),
            reason: Joi.string(),
        },
    },

    // POST /v1/forms
    createForm: {
        body: {
            name: Joi.string().max(128),
            email: Joi.string().email(),
            phone: Joi.string(),
            address: Joi.string(),
            numChildrens: Joi.number(),
            ageChildrens: Joi.string(),
            level: Joi.string(),
            reason: Joi.string(),
        },
    },
};
