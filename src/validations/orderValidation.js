const Joi = require('joi');

const orderSchema = Joi.object({
  userId: Joi.number().integer().required().messages({
    'number.base': 'ID người dùng phải là một số nguyên',
    'any.required': 'ID người dùng là bắt buộc'
  }),
  full_name: Joi.string().required().messages({
    'string.base': 'Tên đầy đủ phải là một chuỗi',
    'any.required': 'Tên đầy đủ là bắt buộc'
  }),
  phone_number: Joi.string().required().messages({
    'string.base': 'Số điện thoại phải là một chuỗi',
    'any.required': 'Số điện thoại là bắt buộc'
  }),
  address: Joi.string().required().messages({
    'string.base': 'Địa chỉ phải là một chuỗi',
    'any.required': 'Địa chỉ là bắt buộc'
  }),
  ward: Joi.string().required().messages({
    'string.base': 'Phường phải là một chuỗi',
    'any.required': 'Phường là bắt buộc'
  }),
  district: Joi.string().required().messages({
    'string.base': 'Quận/Huyện phải là một chuỗi',
    'any.required': 'Quận/Huyện là bắt buộc'
  }),
  province: Joi.string().required().messages({
    'string.base': 'Tỉnh/Thành phố phải là một chuỗi',
    'any.required': 'Tỉnh/Thành phố là bắt buộc'
  }),
  voucher_code: Joi.string().allow(null, '').optional().messages({
    'string.base': 'Mã giảm giá phải là một chuỗi'
  }),
  paymentMethodId: Joi.number().integer().required().messages({
    'number.base': 'ID phương thức thanh toán phải là một số nguyên',
    'any.required': 'ID phương thức thanh toán là bắt buộc'
  }),
  shippingMethodId: Joi.number().integer().required().messages({
    'number.base': 'ID phương thức giao hàng phải là một số nguyên',
    'any.required': 'ID phương thức giao hàng là bắt buộc'
  }),
  shippingCost: Joi.number().precision(2).required().messages({
    'number.base': 'Phí vận chuyển phải là một số',
    'any.required': 'Phí vận chuyển là bắt buộc'
  }),
  notes: Joi.string().optional().allow(null).messages({
    'string.base': 'Ghi chú phải là một chuỗi'
  }),
  items: Joi.array().items(
    Joi.object({
      item_id: Joi.number().integer().required().messages({
        'number.base': 'ID sản phẩm phải là một số nguyên',
        'any.required': 'ID sản phẩm là bắt buộc'
      }),
      quantity: Joi.number().integer().required().messages({
        'number.base': 'Số lượng phải là một số nguyên',
        'any.required': 'Số lượng là bắt buộc'
      })
    })
  ).required().messages({
    'array.base': 'Danh sách sản phẩm phải là một mảng',
    'any.required': 'Danh sách sản phẩm là bắt buộc'
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
