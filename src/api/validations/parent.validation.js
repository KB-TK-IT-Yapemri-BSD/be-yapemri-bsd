const Joi = require('joi');

module.exports = {

    // GET /v1/parents
    listParents: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            status: Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            birthplace: Joi.string(),
            birthdate: Joi.date(),
            gender: Joi.boolean(),
            religion: Joi.string(),
            citizenship: Joi.string(),
            address: Joi.string(),
            phone: Joi.string(),
            occupation: Joi.string(),
            education: Joi.string(),
        },
    },

    // POST /v1/parents
    createParent: {
        body: {
            status: Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            birthplace: Joi.string(),
            birthdate: Joi.date(),
            gender: Joi.boolean(),
            religion: Joi.string(),
            citizenship: Joi.string(),
            address: Joi.string(),
            phone: Joi.string(),
            occupation: Joi.string(),
            education: Joi.string(),
        },
    },

    // PATCH /v1/parents/:parentId
    updateParent: {
        body: {
            status: Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            birthplace: Joi.string(),
            birthdate: Joi.date(),
            gender: Joi.boolean(),
            religion: Joi.string(),
            citizenship: Joi.string(),
            address: Joi.string(),
            phone: Joi.string(),
            occupation: Joi.string(),
            education: Joi.string(),
        },
    },
};
