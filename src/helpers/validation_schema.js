const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  name: Joi.string().required(),
  account_number: Joi.string().required(),
  ifsc_code: Joi.string().required(),
  amount: Joi.string().required(),
})

module.exports = {
  authSchema,
}
