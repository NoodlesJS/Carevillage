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

// POST VALIDATION
function postValidation(data) {
    const schema = joi.object ({
        medicine: joi.string().required(),
        amount: joi.string().required(),
        prescriber: joi.string().required(),
        pharmacy: joi.string().required(),
        start: joi.string().required()
    })
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;