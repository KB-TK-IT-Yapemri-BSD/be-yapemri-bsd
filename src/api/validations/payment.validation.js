const Joi = require('joi');

module.exports = {

    // GET /v1/payments
    listPayments: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            user_id: Joi.string(),
            type_id: Joi.string(),
            deadline: Joi.date(),
            amount: Joi.number(),
            status: Joi.string().allow(null),
            receipt: Joi.string(),
            isOverdue: Joi.boolean(),
        },
    },

    // POST /v1/payments
    createPayment: {
        body: {
            user_id: Joi.string(),
            type_id: Joi.string(),
            deadline: Joi.date(),
            amount: Joi.number(),
        },
    },

    // PATCH /v1/payments/:paymentId
    updatePayment: {
        body: {
            user_id: Joi.string(),
            type_id: Joi.string(),
            deadline: Joi.date(),
            amount: Joi.number(),
            status: Joi.string().allow(null),
            receipt: Joi.string(),
            isOverdue: Joi.boolean(),
        },
    },
};
