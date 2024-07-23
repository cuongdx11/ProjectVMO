const Joi = require('joi');

const paymentMethodSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'string.base': 'Tên phương thức thanh toán phải là một chuỗi',
    'string.max': 'Tên phương thức thanh toán không được vượt quá 100 ký tự',
    'any.required': 'Tên phương thức thanh toán là bắt buộc'
  }),
  description: Joi.string().allow('').optional().messages({
    'string.base': 'Mô tả phải là một chuỗi'
  }),
  is_active: Joi.boolean().default(true).messages({
    'boolean.base': 'Trạng thái hoạt động phải là một giá trị boolean'
  })
});

const validatePaymentMethod = (req, res, next) => {
  const { error } = paymentMethodSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};

module.exports = validatePaymentMethod;
