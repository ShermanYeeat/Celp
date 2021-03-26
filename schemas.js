const Joi = require('joi')

module.exports.vaccineCenterSchema = Joi.object({
    vaccineCenter: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        service: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        description: Joi.string().required(),
        service: Joi.string().required()
    }).required()
})

