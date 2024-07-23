const Joi = require('joi');

const permissionSchema = Joi.object({
    name: Joi.string().max(100).required().messages({
        'string.base': 'Tên quyền phải là một chuỗi',
        'string.max': 'Tên quyền không được vượt quá 100 ký tự',
        'any.required': 'Tên quyền là bắt buộc'
    }),
    description: Joi.string().allow('').optional().messages({
        'string.base': 'Mô tả phải là một chuỗi'
    })
});

const validatePermission = (req, res, next) => {
    const { error } = permissionSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
};

module.exports = validatePermission;
