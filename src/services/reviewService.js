const Review = require('../models/reviewModel')
const ErrorRes = require('../helpers/ErrorRes')

const getReviewsById = async(id) => {
    try {
        const review = await Review.findByPk(id)
        if(!review){
            throw new ErrorRes( 404,'Đánh giá không tồn tại')
        }
        return review
    } catch (error) {
        throw error
    }
}

const createReview = async(reviewData) => {
    try {
        const {user_id,item_id,rating} = reviewData
        if(!user_id||!item_id||!rating){
            throw new ErrorRes(400,'Thiếu dữ liệu bắt buộc')
        }
        const review = await Review.create(reviewData)
        return review
    } catch (error) {
        throw error
    }
}

const updateReview = async(id,reviewData) => {
    try {
        const review = await Review.findByPk(id)
        if(!review){
            throw new ErrorRes(404,'Đánh giá không tồn tại')
        }
        const updateReview = await review.update(reviewData)
        return updateReview
    } catch (error) {
        throw error
    }
}
const deleteReview = async(id) => {
    try {
        const review = await Review.findByPk(id)
        if(!review){
            throw new ErrorRes(404,'Đánh giá không tồn tại')
        }
        await review.destroy()
    } catch (error) {
        throw error
    }
}

module.exports = {
    getReviewsById,
    createReview,
    updateReview,
    deleteReview
}