const Joi = require('joi');

const authChangePassSchema = Joi.object({
    newPass: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.base': 'Mật khẩu mới phải là một chuỗi ký tự',
            'string.empty': 'Mật khẩu mới không được để trống',
            'string.min': 'Mật khẩu mới phải có ít nhất {#limit} ký tự',
            'any.required': 'Mật khẩu mới là bắt buộc'
        }),
    oldPass: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.base': 'Mật khẩu cũ phải là một chuỗi ký tự',
            'string.empty': 'Mật khẩu cũ không được để trống',
            'string.min': 'Mật khẩu cũ phải có ít nhất {#limit} ký tự',
            'any.required': 'Mật khẩu cũ là bắt buộc'
        })
}).custom((value, helpers) => {
    if (value.newPass === value.oldPass) {
        return helpers.message('Mật khẩu mới không được trùng với mật khẩu cũ');
    }
    return value;
});

const authLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email phải là một địa chỉ email hợp lệ',
        'string.empty': 'Email không được để trống',
        'any.required': 'Email là bắt buộc'
    }),
    password: Joi.string().min(6).max(100).required().messages({
        'string.base': 'Mật khẩu phải là một chuỗi',
        'string.empty': 'Mật khẩu không được để trống',
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'string.max': 'Mật khẩu chỉ được tối đa 30 ký tự',
        'any.required': 'Mật khẩu là bắt buộc'
      }),
    
})
const authForgotPassSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email phải là một địa chỉ email hợp lệ',
        'string.empty': 'Email không được để trống',
        'any.required': 'Email là bắt buộc'
    }),
})
const authRegisterSchema = Joi.object({
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
      is_notification: Joi.boolean().default(false).messages({
        'boolean.base': 'Trạng thái thông báo phải là kiểu boolean'
      })
})
const validateAuthChangePass = (req, res, next) => {
    const { error } = authChangePassSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
};
const validateAuthLogin = (req,res,next) => {
    const { error } = authLoginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
}
const validateAuthForgotPass = (req,res,next) => {
    const { error } = authForgotPassSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
}
const validateAuthRegister = (req,res,next) => {
    const { error } = authRegisterSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
}
module.exports = {
    validateAuthChangePass,
    validateAuthLogin,
    validateAuthForgotPass,
    validateAuthRegister
}
