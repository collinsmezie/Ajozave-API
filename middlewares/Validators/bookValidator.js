const joi = require('joi');


const newBookSchema = joi.object({
    title: joi.string()
        .min(4)
        .max(30)
        .required(),

    author: joi.string()
        .min(4)
        .max(30)
        .required(),

    category: joi.string()
        .min(4)
        .max(30)
        .required(),

    current_chapter: joi.string()
        .min(4)
        .max(30)
        .required(),

    progress: joi.number()
        .min(0)
        .max(100)
        .required()
});

const updateBookSchema = joi.object({
    title: joi.string()
        .min(4)
        .max(30),
    author: joi.string()
        .min(4)
        .max(30)
        .trim(),
    category: joi.string()
        .min(4)
        .max(30),
    current_chapter: joi.string()
        .min(1)
        .max(30),
    progress: joi.number()
        .min(0)
        .max(100)
});


const newBookValidatorMiddleware = async (req, res, next) => {
    const book = req.body;
    try {
        await newBookSchema.validateAsync(book);
        next();
    } catch (error) {
        res.status(406).send(error.details[0].message);
    }
}



const updatedBookValidatorMiddleware = async (req, res, next) => {
    const book = req.body;
    try {
        await updateBookSchema.validateAsync(book);
        next();
    } catch (error) {
        res.status(406).send(error.details[0].message);
    }
}



module.exports = {
    newBookValidatorMiddleware,
    updatedBookValidatorMiddleware
}