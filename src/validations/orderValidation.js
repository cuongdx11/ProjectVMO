const Joi = require('joi');

const orderSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    'number.base': 'ID người dùng phải là một số nguyên',
    'any.required': 'ID người dùng là bắt buộc'
  }),
  shipping_address_id: Joi.number().integer().optional().allow(null).messages({
    'number.base': 'ID địa chỉ giao hàng phải là một số nguyên'
  }),
  shipment_id: Joi.number().integer().optional().allow(null).messages({
    'number.base': 'ID vận chuyển phải là một số nguyên'
  }),
  payment_id: Joi.number().integer().optional().allow(null).messages({
    'number.base': 'ID thanh toán phải là một số nguyên'
  }),
  subtotal: Joi.number().precision(2).required().messages({
    'number.base': 'Tổng tiền phải là một số',
    'number.empty': 'Tổng tiền không được để trống',
    'any.required': 'Tổng tiền là bắt buộc'
  }),
  total_amount: Joi.number().precision(2).required().messages({
    'number.base': 'Số tiền thanh toán phải là một số',
    'number.empty': 'Số tiền thanh toán không được để trống',
    'any.required': 'Số tiền thanh toán là bắt buộc'
  }),
  discount: Joi.number().precision(2).optional().allow(null).messages({
    'number.base': 'Giảm giá phải là một số'
  }),
  order_date: Joi.date().required().messages({
    'date.base': 'Ngày đặt hàng phải là một ngày hợp lệ',
    'any.required': 'Ngày đặt hàng là bắt buộc'
  }),
  status: Joi.string().valid('pending', 'completed', 'cancelled').default('pending').messages({
    'string.base': 'Trạng thái đơn hàng phải là một chuỗi',
    'any.only': 'Trạng thái đơn hàng phải là "pending", "completed" hoặc "cancelled"'
  }),
  payment_status: Joi.string().valid('unpaid', 'paid', 'refunded').default('unpaid').messages({
    'string.base': 'Trạng thái thanh toán phải là một chuỗi',
    'any.only': 'Trạng thái thanh toán phải là "unpaid", "paid" hoặc "refunded"'
  }),
  notes: Joi.string().optional().allow(null).messages({
    'string.base': 'Ghi chú phải là một chuỗi'
  })
});

const validateOrder = (req, res, next) => {
  const { error } = orderSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};

module.exports = validateOrder;
