const Joi = require('joi');

const shippingMethodSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'string.base': 'Tên phương thức vận chuyển phải là một chuỗi',
    'string.max': 'Tên phương thức vận chuyển không được vượt quá 100 ký tự',
    'any.required': 'Tên phương thức vận chuyển là bắt buộc'
  }),
  description: Joi.string().allow('').optional().messages({
    'string.base': 'Mô tả phải là một chuỗi'
  }),
  base_cost: Joi.number().precision(2).required().messages({
    'number.base': 'Chi phí cơ bản phải là một số',
    'any.required': 'Chi phí cơ bản là bắt buộc'
  }),
  carrier: Joi.string().max(100).optional().allow(null).messages({
    'string.base': 'Nhà vận chuyển phải là một chuỗi',
    'string.max': 'Nhà vận chuyển không được vượt quá 100 ký tự'
  }),
  is_active: Joi.boolean().default(true).messages({
    'boolean.base': 'Trạng thái hoạt động phải là một giá trị boolean'
  })
});

const validateShippingMethod = (req, res, next) => {
  const { error } = shippingMethodSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};

module.exports = validateShippingMethod;
