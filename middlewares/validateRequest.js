// // middlewares/validateRequest.js

// const validateRequest = (schema) => (req, res, next) => {
//     const { error } = schema.validate(req.body, { abortEarly: false });
//     if (error) {
//       console.log("Error inside validate function", error.message)
//       return res.status(400).json({
//         error: error.details.map((err) => err.message),
//       });
//     }
//     next();
//   };
  
//   module.exports = validateRequest;


const validateRequest = (schema, source = 'body') => (req, res, next) => {
  // Determine the part of the request to validate based on the source parameter
  const dataToValidate = source === 'params' ? req.params : req.body;

  const { error } = schema.validate(dataToValidate, { abortEarly: false });
  if (error) {
    console.log("Error inside validate function", error.message);
    return res.status(400).json({
      error: error.details.map((err) => err.message),
    });
  }
  next();
};

module.exports = validateRequest;
