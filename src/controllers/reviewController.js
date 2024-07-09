const reviewService = require('../services/reviewService')


const getReviewsById = async(req,res,next) => {
    try {
        const {id} = req.params
        const review = await reviewService.getReviewsById(id)
        res.status(200).json({
            status: 'success',
            data: review
        })
    } catch (error) {
        next(error)
    }
}

const createReview = async(req,res,next) => {
    try {
        const reviewData = req.body
        const review = await reviewService.createReview(reviewData)
        res.status(201).json({
            status: 'success',
            message :'Thêm đánh giá thành công',
            data: review
        })
    } catch (error) {
        next(error)
    }
}
const updateReview = async(req,res,next) => {
    try {
        const reviewData = req.body
        const {id} = req.params
        const review = await reviewService.updateReview(id,reviewData)
        res.status(200).json({
            status: 'success',
            message :'Cập nhật đánh giá thành công',
            data: review
        })
    } catch (error) {
        next(error)
    }
}
const deleteReview = async(res,req,next) => {
    try {
        const {id} = req.params
        await reviewService.deleteReview(id)
        res.status(200).json({
            status: 'success',
            message :'Xóa đánh giá thành công'
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getReviewsById,
    createReview,
    updateReview,
    deleteReview
}