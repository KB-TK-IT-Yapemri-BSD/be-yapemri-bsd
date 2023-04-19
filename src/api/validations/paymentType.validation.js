const Joi = require('joi');

module.exports = {

    // GET /v1/payments/types
    listPaymentTypes: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            type: Joi.string(),
        },
    },

    // POST /v1/payments/types
    createPaymentType: {
        body: {
            type: Joi.string(),
        },
    },
};
