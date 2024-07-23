const Joi = require('joi');

const roleSchema = Joi.object({
  name: Joi.string().max(50).required().messages({
    'string.base': 'Tên vai trò phải là một chuỗi',
    'string.max': 'Tên vai trò không được vượt quá 50 ký tự',
    'any.required': 'Tên vai trò là bắt buộc'
  }),
  description: Joi.string().allow('').optional().messages({
    'string.base': 'Mô tả phải là một chuỗi'
  })
});

const validateRole = (req, res, next) => {
  const { error } = roleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};

module.exports = validateRole;
