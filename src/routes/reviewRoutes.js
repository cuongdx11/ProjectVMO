const router = require('express').Router();
const reviewController = require('../controllers/reviewController')

router.get('/:id',reviewController.getReviewsById)
router.post('/',reviewController.createReview)
router.put('/:id',reviewController.updateReview)
router.delete('/:id',reviewController.deleteReview)


module.exports = router