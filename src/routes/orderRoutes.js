const router = require('express').Router();
const orderController = require('../controllers/orderController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const createPayUrl = require('../helpers/createPaymentUrl')
const PERMISSIONS = require('../constants/permissions')
const orderValidate = require('../validations/orderValidation')

//User
router.use(authenticateToken)
router.get('/',checkPermission(PERMISSIONS.VIEW_ORDERS), orderController.getOrders)
router.post('/',orderController.createOrder)
router.post('/checkout',orderValidate,orderController.createOrder)
router.get('/payment',orderController.payOrder)
router.get('/:id/cancel',orderController.cancelledOrder)
router.get('/:id',orderController.getOrderById)
router.post('/create-payment-url',createPayUrl.createPaymentUrlOrder)
router.post('/apply-voucher',orderController.applyVoucher)
//Admin
router.put('/:id',orderController.updateOrder)
router.delete('/:id',orderController.deleteOrder)

module.exports = router