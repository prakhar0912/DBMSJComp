const joi = require('@hapi/joi')



const registerValidation = (body) => {
    const now = Date.now();
    const cutoffDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 18));

    const schema = joi.object({
        name: joi.string().min(6).required(),
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required(),
        dob: joi.date().max(cutoffDate).required(),
        sex: joi.string()
    })

    return schema.validate(body)
}

const loginValidation = (body) => {

    const schema = joi.object({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required(),
    })

    return schema.validate(body)

}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;