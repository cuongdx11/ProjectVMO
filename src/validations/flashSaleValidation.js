const Joi = require('joi');

const flashSaleSchema = Joi.object({
  name: Joi.string().max(255).required().messages({
    'string.base': 'Tên phải là một chuỗi',
    'string.max': 'Tên không được vượt quá 255 ký tự',
    'any.required': 'Tên là bắt buộc'
  }),
  status: Joi.string().valid('preparing', 'active', 'ended').required().messages({
    'string.base': 'Trạng thái phải là một chuỗi',
    'any.only': 'Trạng thái phải là "preparing", "active" hoặc "ended"',
    'any.required': 'Trạng thái là bắt buộc'
  }),
  start_time: Joi.date().required().messages({
    'date.base': 'Thời gian bắt đầu phải là một ngày hợp lệ',
    'any.required': 'Thời gian bắt đầu là bắt buộc'
  }),
  end_time: Joi.date().required().messages({
    'date.base': 'Thời gian kết thúc phải là một ngày hợp lệ',
    'any.required': 'Thời gian kết thúc là bắt buộc'
  })
});

const validateFlashSale = (req, res, next) => {
  const { error } = flashSaleSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};

module.exports = validateFlashSale;
