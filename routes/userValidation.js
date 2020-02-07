const joi = require('@hapi/joi');

// REGISTER VALIDATION
function registerValidation(data) {
    const schema = joi.object({
        name: joi.string().min(3).required(),
        email: joi.string().min(6).required(),
        password: joi.string().min(6).required()
    })
    return schema.validate(data);
}

// LOGIN VALIDATION
function loginValidation(data) {
    const schema = joi.object({
        email: joi.string().min(6).required(),
        password: joi.string().min(6).required()
    })
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;