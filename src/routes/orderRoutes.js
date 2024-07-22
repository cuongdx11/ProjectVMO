const router = require('express').Router();
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middlewares/authMiddleware')
const createPayUrl = require('../helpers/createPaymentUrl')
const PERMISSIONS = require('../constants/permissions')

//User
router.use(authMiddleware.authenticateToken)
router.get('/',authMiddleware.checkPermission(PERMISSIONS.VIEW_ORDERS), orderController.getOrders)
router.post('/',orderController.createOrder)
router.post('/checkout',orderController.checkOut)
router.get('/payment',orderController.payOrder)
router.get('/:id/cancel',orderController.cancelledOrder)
router.get('/:id',orderController.getOrderById)
router.post('/create-payment-url',createPayUrl.createPaymentUrlOrder)
router.post('/apply-voucher',orderController.applyVoucher)
//Admin
router.put('/:id',orderController.updateOrder)
router.delete('/:id',orderController.deleteOrder)

module.exports = router