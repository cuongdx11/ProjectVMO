const router = require('express').Router();
const paymentController = require('../controllers/paymentController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')


router.get('/',paymentController.getAllPayment)
router.get('/:id',paymentController.getPaymentById)
router.post('/',paymentController.createPayment)
router.put('/:id',paymentController.updatePayment)
router.delete('/:id',paymentController.deletePayment)
router.use(authenticateToken)
router.post('/method',paymentController.createPaymentMethod)
router.put('/method/:id',paymentController.updatePaymentMethod)
router.delete('/method',paymentController.deletePaymentMethod)
router.get('/method',paymentController.getPaymentMethod)
router.get('/VNPay',paymentController.paymentVNPay)

module.exports = router