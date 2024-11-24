const { body, validationResult } = require("express-validator");
const SystemResponse = require("../utils/response-handler/SystemResponse");
const Joi = require("joi");

class Validation {
  static validateUser() {
    return [
      body("email")
        .isEmail()
        .withMessage("Email is not valid")
        .notEmpty()
        .withMessage("Email is required"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[A-Za-z]/) 
        .withMessage("Password must contain at least one alphabetic character")
        .matches(/\d/)
        .withMessage("Password must contain at least one numeric character")
        .matches(/[@$!%*?&]/)
        .withMessage("Password must contain at least one special character"),
    ];
  }

  static checkValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(SystemResponse.badRequest(errors.array()));
    }
    next();
  }

  static bulkUpload(data) {
    const JoiSchema = Joi.object({
      email: Joi.string().required(),
      name: Joi.string().required().min(5),
      address: Joi.object({
        street: Joi.string().required().min(1),
        city: Joi.string().required().min(1),
        state: Joi.string().required().min(1),
        pinCode: Joi.string().required().min(1),
      }).required(),
      description: Joi.string().required().min(20).max(1000),
      startDate: Joi.date().required().min(10),
      endDate: Joi.date().greater(Joi.ref("startDate")).required().min(10),
      Bhktype: Joi.string().required().min(3),
      owner: Joi.string().required().min(3),
      price: Joi.number().required().min(3),
    }).options({ abortEarly: false });
    return JoiSchema.validate(data);
  }

  static async checkvalid(req, res, next) {
    const response = Validation.bulkUpload(req.body);
    if (response.error) {
      return res
        .status(400)
        .send(SystemResponse.badRequest(response.error.details));
    } else {
      next();
    }
  }

}

module.exports = Validation;
