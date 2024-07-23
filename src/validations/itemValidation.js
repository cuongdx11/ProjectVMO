const Joi = require('joi');

const itemSchema = Joi.object({
  category_id: Joi.number().integer().required().messages({
    'number.base': 'ID danh mục phải là một số nguyên',
    'any.required': 'ID danh mục là bắt buộc'
  }),
  name: Joi.string().max(100).required().messages({
    'string.base': 'Tên sản phẩm phải là một chuỗi',
    'string.empty': 'Tên sản phẩm không được để trống',
    'string.max': 'Tên sản phẩm chỉ được tối đa 100 ký tự',
    'any.required': 'Tên sản phẩm là bắt buộc'
  }),
  barcode: Joi.string().max(50).optional().messages({
    'string.base': 'Mã vạch phải là một chuỗi',
    'string.max': 'Mã vạch chỉ được tối đa 50 ký tự'
  }),
  purchase_price: Joi.number().precision(2).required().messages({
    'number.base': 'Giá mua phải là một số',
    'number.empty': 'Giá mua không được để trống',
    'any.required': 'Giá mua là bắt buộc'
  }),
  selling_price: Joi.number().precision(2).required().messages({
    'number.base': 'Giá bán phải là một số',
    'number.empty': 'Giá bán không được để trống',
    'any.required': 'Giá bán là bắt buộc'
  }),
  weight: Joi.number().precision(2).optional().allow(null).messages({
    'number.base': 'Trọng lượng phải là một số'
  }),
  thumbnail: Joi.string().uri().optional().allow(null).messages({
    'string.uri': 'Ảnh đại diện phải là một URL hợp lệ'
  }),
  description: Joi.string().optional().allow(null).messages({
    'string.base': 'Mô tả phải là một chuỗi'
  }),
  stock_quantity: Joi.number().integer().required().messages({
    'number.base': 'Số lượng tồn kho phải là một số nguyên',
    'any.required': 'Số lượng tồn kho là bắt buộc'
  })
});

const validateItem = (req, res, next) => {
  const { error } = itemSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};

module.exports = validateItem;
