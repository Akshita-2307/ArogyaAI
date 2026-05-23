const ApiError = require('../utils/ApiError');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new ApiError(400, errorMessage));
    }

    // Apply Joi-transformed payload (e.g., stripUnknown) so controllers receive sanitized input.
    req.body = value;
    next();
  };
};

module.exports = { validateRequest };
