const Joi = require("joi");

module.exports = {
  // GET /v1/staffs
  listStaffs: {
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
      education: Joi.string(),
      dataStatus: Joi.string(),
    },
  },

  // POST /v1/staffs
  createStaff: {
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
      education: Joi.string(),
      dataStatus: Joi.string(),
    },
  },

  // PATCH /v1/staffs/:staffId
  updateStaff: {
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
      education: Joi.string(),
      dataStatus: Joi.string(),
    },
  },
};
