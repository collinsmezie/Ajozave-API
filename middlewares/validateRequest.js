// middlewares/validateRequest.js

const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // console.log("inside validate function", req.body)
      return res.status(400).json({
        error: error.details.map((err) => err.message),
      });
    }
    next();
  };
  
  module.exports = validateRequest;
  