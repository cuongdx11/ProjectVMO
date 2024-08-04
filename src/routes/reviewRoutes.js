const router = require('express').Router();
const reviewController = require('../controllers/reviewController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const PERMISSIONS = require('../constants/permissions');


router.use(authenticateToken)

router.get('/',checkPermission(PERMISSIONS.VIEW_REVIEWS),reviewController.getReviews)
router.get('/:id',checkPermission(PERMISSIONS.VIEW_REVIEW),reviewController.getReviewsById)
router.post('/',checkPermission(PERMISSIONS.CREATE_REVIEW),reviewController.createReview)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_REVIEW),reviewController.updateReview)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_REVIEW),reviewController.deleteReview)


module.exports = router