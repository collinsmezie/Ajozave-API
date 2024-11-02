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



// Define the Joi schema for validation
const addMembersSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    'string.length': 'Session ID must be a 24-character hex string',
    'string.hex': 'Session ID must contain only hexadecimal characters',
    'any.required': 'Session ID is required',
  }),
  members: Joi.array()
    .items(Joi.string().length(24).hex().messages({
      'string.length': 'Each member ID must be a 24-character hex string',
      'string.hex': 'Each member ID must contain only hexadecimal characters',
    }))
    .required()
    .messages({
      'any.required': 'Member IDs array is required',
      'array.base': 'Member IDs must be an array',
    }),
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
  addMembersSchema,
  joinSessionSchema,
  pickTurnSchema,
  exitSessionSchema,
};
