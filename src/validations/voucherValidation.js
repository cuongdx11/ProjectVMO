const Joi = require('joi');

const voucherSchema = Joi.object({
  code: Joi.string().max(50).required().messages({
    'string.base': 'Mã voucher phải là một chuỗi',
    'string.empty': 'Mã voucher không được để trống',
    'string.max': 'Mã voucher chỉ được tối đa 50 ký tự',
    'any.required': 'Mã voucher là bắt buộc'
  }),
  type: Joi.string().required().messages({
    'string.base': 'Loại voucher phải là một chuỗi',
    'string.empty': 'Loại voucher không được để trống',
    'any.required': 'Loại voucher là bắt buộc'
  }),
  discount_amount: Joi.number().precision(2).required().messages({
    'number.base': 'Số tiền giảm giá phải là một số',
    'number.empty': 'Số tiền giảm giá không được để trống',
    'any.required': 'Số tiền giảm giá là bắt buộc'
  }),
  discount_type: Joi.string().valid('percentage', 'fixed').required().messages({
    'string.base': 'Loại giảm giá phải là một chuỗi',
    'any.only': 'Loại giảm giá chỉ có thể là "percentage" hoặc "fixed"',
    'any.required': 'Loại giảm giá là bắt buộc'
  }),
  start_date: Joi.date().required().messages({
    'date.base': 'Ngày bắt đầu phải là một ngày hợp lệ',
    'any.required': 'Ngày bắt đầu là bắt buộc'
  }),
  end_date: Joi.date().required().messages({
    'date.base': 'Ngày kết thúc phải là một ngày hợp lệ',
    'any.required': 'Ngày kết thúc là bắt buộc'
  }),
  quantity: Joi.number().integer().required().messages({
    'number.base': 'Số lượng phải là một số nguyên',
    'any.required': 'Số lượng là bắt buộc'
  }),
  remaining_quantity: Joi.number().integer().required().messages({
    'number.base': 'Số lượng còn lại phải là một số nguyên',
    'any.required': 'Số lượng còn lại là bắt buộc'
  }),
  min_order_value: Joi.number().precision(2).required().messages({
    'number.base': 'Giá trị đơn hàng tối thiểu phải là một số',
    'number.empty': 'Giá trị đơn hàng tối thiểu không được để trống',
    'any.required': 'Giá trị đơn hàng tối thiểu là bắt buộc'
  })
});

const validateVoucher = (req, res, next) => {
  const { error } = voucherSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};

module.exports = validateVoucher;
