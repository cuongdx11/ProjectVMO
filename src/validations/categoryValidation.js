const Joi = require('joi');

const categorySchema = Joi.object({
  parent_id: Joi.number().integer().allow(null).messages({
    'number.base': 'ID danh mục cha phải là một số nguyên',
  }),
  name: Joi.string().max(100).required().messages({
    'string.base': 'Tên danh mục phải là một chuỗi',
    'string.empty': 'Tên danh mục không được để trống',
    'string.max': 'Tên danh mục chỉ được tối đa 100 ký tự',
    'any.required': 'Tên danh mục là bắt buộc'
  }),
  position: Joi.number().integer().required().messages({
    'number.base': 'Vị trí phải là một số nguyên',
    'number.empty': 'Vị trí không được để trống',
    'any.required': 'Vị trí là bắt buộc'
  }),
  banner_image: Joi.string().uri().optional().allow(null).messages({
    'string.uri': 'Ảnh banner phải là một URL hợp lệ'
  }),
  status: Joi.string().valid('active', 'inactive').default('active').messages({
    'string.base': 'Trạng thái phải là một chuỗi',
    'any.only': 'Trạng thái chỉ có thể là "active" hoặc "inactive"'
  })
})

const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next()
}

module.exports = validateCategory
