const Joi = require('joi');

const reviewSchema = Joi.object({
    item_id: Joi.number().integer().required().messages({
        'number.base': 'ID sản phẩm phải là một số nguyên',
        'any.required': 'ID sản phẩm là bắt buộc'
    }),
    user_id: Joi.number().integer().required().messages({
        'number.base': 'ID người dùng phải là một số nguyên',
        'any.required': 'ID người dùng là bắt buộc'
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.base': 'Đánh giá phải là một số nguyên',
        'number.min': 'Đánh giá phải từ 1 đến 5',
        'number.max': 'Đánh giá phải từ 1 đến 5',
        'any.required': 'Đánh giá là bắt buộc'
    }),
    comment: Joi.string().allow('').optional().messages({
        'string.base': 'Bình luận phải là một chuỗi'
    })
});

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }
    next();
};

module.exports = validateReview;
