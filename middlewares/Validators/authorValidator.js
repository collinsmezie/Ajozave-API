const joi = require('joi');

const newAuthorSchema = joi.object({
    firstName: joi.string()
        .min(4)
        .max(30)
        .required(),

    lastName: joi.string()
        .min(4)
        .max(30)
        .required(),

    dob: joi.date()
        .min('01-01-1900')
        .max('01-01-2023')
        .required(),

    country: joi.string()
        .min(4)
        .max(30)
        .required(),

    books: joi.array()
        .items(joi.string())
});

const updateAuthorSchema = joi.object({
    firstName: joi.string()
        .min(4)
        .max(30),

    lastName: joi.string()
        .min(4)
        .max(30),

    dob: joi.string()
        .min(4)
        .max(30),

    country: joi.string()
        .min(4)
        .max(30),

    books: joi.array()
        .items(joi.string())
});

const newAuthorValidatorMiddleware = async (req, res, next) => {
    const author = req.body;
    try {
        await newAuthorSchema.validateAsync(author);
        next();
    } catch (error) {
        res.status(406).send(error.details[0].message);
    }
}

const updatedAuthorValidatorMiddleware = async (req, res, next) => {
    const author = req.body;
    try {
        await updateAuthorSchema.validateAsync(author);
        next();
    } catch (error) {
        res.status(406).send(error.details[0].message);
    }
}

module.exports = {
    newAuthorValidatorMiddleware,
    updatedAuthorValidatorMiddleware
}