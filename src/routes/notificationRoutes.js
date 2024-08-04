const PERMISSIONS = require('../constants/permissions')
const notificationsController = require('../controllers/notificationController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')

const router = require('express').Router()


router.use(authenticateToken)

router.get('/',checkPermission(PERMISSIONS.VIEW_NOTIFICATIONS),notificationsController.getNotifications)
router.get('/:id',checkPermission(PERMISSIONS.VIEW_NOTIFICATION),notificationsController.getNotificationById)
router.post('/',checkPermission(PERMISSIONS.CREATE_NOTIFICATION),notificationsController.createNotification)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_NOTIFICATION),notificationsController.updateNotification)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_NOTIFICATION),notificationsController.deleteNotification)
router.get('/mask-read',checkPermission(PERMISSIONS.MASK_READ_NOTIFICATION),notificationsController.maskAllNotifications)

module.exports = router