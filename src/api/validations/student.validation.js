const Joi = require('joi');

module.exports = {

    // GET /v1/students
    listStudents: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            firstName: Joi.string(),
            lastName: Joi.string(),
            birthplace: Joi.string(),
            birthdate: Joi.date(),
            gender: Joi.boolean(),
            religion: Joi.string(),
            citizenship: Joi.string(),
            picture: Joi.string(),
            address: Joi.string(),
            nickname: Joi.string(),
            birthOrder: Joi.number(),
            numOfSiblings: Joi.number(),
            statusInFamily: Joi.string(),
            height: Joi.number(),
            bloodType: Joi.string(),
            diseaseHistory: Joi.string(),
            distanceToHome: Joi.string(),
            language: Joi.string(),
        },
    },

    // POST /v1/students
    createStudent: {
        body: {
            firstName: Joi.string(),
            lastName: Joi.string(),
            birthplace: Joi.string(),
            birthdate: Joi.date(),
            gender: Joi.boolean(),
            religion: Joi.string(),
            citizenship: Joi.string(),
            picture: Joi.string(),
            address: Joi.string(),
            nickname: Joi.string(),
            birthOrder: Joi.number(),
            numOfSiblings: Joi.number(),
            statusInFamily: Joi.string(),
            height: Joi.number(),
            bloodType: Joi.string(),
            diseaseHistory: Joi.string(),
            distanceToHome: Joi.string(),
            language: Joi.string(),
        },
    },

    // PATCH /v1/students/:studentId
    updateStudent: {
        body: {
            firstName: Joi.string(),
            lastName: Joi.string(),
            birthplace: Joi.string(),
            birthdate: Joi.date(),
            gender: Joi.boolean(),
            religion: Joi.string(),
            citizenship: Joi.string(),
            picture: Joi.string(),
            address: Joi.string(),
            nickname: Joi.string(),
            birthOrder: Joi.number(),
            numOfSiblings: Joi.number(),
            statusInFamily: Joi.string(),
            height: Joi.number(),
            bloodType: Joi.string(),
            diseaseHistory: Joi.string(),
            distanceToHome: Joi.string(),
            language: Joi.string(),
        },
    },
};
