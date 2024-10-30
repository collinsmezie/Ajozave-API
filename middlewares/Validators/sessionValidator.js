// middlewares/validators/sessionValidator.js

const Joi = require('joi');

const createSessionSchema = Joi.object({
  sessionName: Joi.string().required().messages({
    'string.empty': 'Session name is required.',
  }),
  contributionAmount: Joi.number().required().messages({
    'number.base': 'Contribution amount must be a number.',
    'any.required': 'Contribution amount is required.',
  }),
  duration: Joi.number().required().messages({
    'number.base': 'Duration must be a number.',
    'any.required': 'Duration is required.',
  }),
  numberOfMembers: Joi.number().required().messages({
    'number.base': 'Number of members must be a number.',
    'any.required': 'Number of members is required.',
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date.',
    'any.required': 'Start date is required.',
  }),
  endDate: Joi.date().required().messages({
    'date.base': 'End date must be a valid date.',
    'any.required': 'End date is required.',
  }),
})
  .custom((value, helpers) => {
    if (value.startDate > value.endDate) {
      return helpers.message('Start date cannot be greater than end date.');
    }
    return value;
  });


const joinSessionSchema = Joi.object({
  sessionId: Joi.string().required().messages({
    'string.empty': 'Session ID is required to join the session.',
  }),
  memberId: Joi.string().required().messages({
    'string.empty': 'Member ID is required to join the session.',
  }),
});

const pickTurnSchema = Joi.object({
  sessionId: Joi.string().required().messages({
    'string.empty': 'Session ID is required to pick a turn.',
  }),
  memberId: Joi.string().required().messages({
    'string.empty': 'Member ID is required to pick a turn.',
  }),
});

const exitSessionSchema = Joi.object({
  sessionId: Joi.string().required().messages({
    'string.empty': 'Session ID is required to exit the session.',
  }),
  memberId: Joi.string().required().messages({
    'string.empty': 'Member ID is required to exit the session.',
  }),
});

module.exports = {
  createSessionSchema,
  joinSessionSchema,
  pickTurnSchema,
  exitSessionSchema,
};
