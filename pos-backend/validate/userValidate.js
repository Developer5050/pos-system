const Joi = require("joi");

const passwordPattern = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
);

const userSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  businessName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordPattern).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  role: Joi.string().valid(0, 1).required(),
});

module.exports = userSchema;
