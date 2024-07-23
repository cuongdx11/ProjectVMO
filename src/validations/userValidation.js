const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.base': 'Tên người dùng phải là một chuỗi',
    'string.alphanum': 'Tên người dùng chỉ chứa các ký tự chữ và số',
    'string.empty': 'Tên người dùng không được để trống',
    'string.min': 'Tên người dùng phải có ít nhất 3 ký tự',
    'string.max': 'Tên người dùng chỉ được tối đa 30 ký tự',
    'any.required': 'Tên người dùng là bắt buộc'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email phải là một địa chỉ email hợp lệ',
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.base': 'Mật khẩu phải là một chuỗi',
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.max': 'Mật khẩu chỉ được tối đa 30 ký tự',
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(20).optional().allow(null).messages({
    'string.base': 'Số điện thoại phải là một chuỗi',
    'string.pattern.base': 'Số điện thoại chỉ chứa các chữ số',
    'string.min': 'Số điện thoại phải có ít nhất 10 chữ số',
    'string.max': 'Số điện thoại chỉ được tối đa 20 chữ số'
  }),
  avatar: Joi.string().uri().optional().allow(null).messages({
    'string.uri': 'Avatar phải là một URL hợp lệ'
  }),
  full_name: Joi.string().max(100).optional().allow(null).messages({
    'string.base': 'Họ và tên phải là một chuỗi',
    'string.max': 'Họ và tên chỉ được tối đa 100 ký tự'
  }),
  is_notification: Joi.boolean().default(false).messages({
    'boolean.base': 'Trạng thái thông báo phải là kiểu boolean'
  })
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(detail => detail.message) });
  }
  next();
};

module.exports = validateUser;
