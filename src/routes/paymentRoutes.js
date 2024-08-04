const router = require('express').Router();
const PERMISSIONS = require('../constants/permissions');
const paymentController = require('../controllers/paymentController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')

router.use(authenticateToken)

router.get('/',checkPermission(PERMISSIONS.VIEW_PAYMENTS),paymentController.getAllPayment)
router.get('/:id',checkPermission(PERMISSIONS.VIEW_PAYMENT),paymentController.getPaymentById)
router.post('/',checkPermission(PERMISSIONS.CREATE_PAYMENT),paymentController.createPayment)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_PAYMENT),paymentController.updatePayment)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_PAYMENT),paymentController.deletePayment)


router.post('/method',checkPermission(PERMISSIONS.CREATE_PAYMENT_METHOD),paymentController.createPaymentMethod)
router.put('/method/:id',checkPermission(PERMISSIONS.UPDATE_PAYMENT_METHOD),paymentController.updatePaymentMethod)
router.delete('/method/:id',checkPermission(PERMISSIONS.DELETE_PAYMENT_METHOD),paymentController.deletePaymentMethod)
router.get('/method',checkPermission(PERMISSIONS.VIEW_PAYMENT_METHODS),paymentController.getPaymentMethod)
router.get('/method/:id',checkPermission(PERMISSIONS.VIEW_PAYMENT_METHOD),paymentController.getPaymentMethodById)
router.get('/VNPay',checkPermission(PERMISSIONS.PAYMENT_VNPAY),paymentController.paymentVNPay)

module.exports = router