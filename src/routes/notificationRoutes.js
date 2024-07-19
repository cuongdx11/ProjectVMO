const notificationsController = require('../controllers/notificationController')

const router = require('express').Router()

router.get('/',notificationsController.getNotifications)
router.get('/mask-read',notificationsController.maskAllNotifications)

module.exports = router