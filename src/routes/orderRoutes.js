const router = require('express').Router();
const orderController = require('../controllers/orderController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const createPayUrl = require('../helpers/createPaymentUrl')
const PERMISSIONS = require('../constants/permissions')
const orderValidate = require('../validations/orderValidation')

//User
router.use(authenticateToken)
router.get('/',checkPermission(PERMISSIONS.VIEW_ORDERS), orderController.getOrders)
router.post('/',checkPermission(PERMISSIONS.CREATE_ORDER),orderController.createOrder)
router.post('/checkout',checkPermission(PERMISSIONS.CREATE_ORDER_USER),orderController.createOrderByUser)
router.get('/paymentVNPay',checkPermission(PERMISSIONS.PAYMENT_VNPAY),orderController.payOrder)
router.get('/:id/cancel',orderController.cancelledOrder)
router.get('/:id',checkPermission(PERMISSIONS.VIEW_ORDER),orderController.getOrderById)
router.post('/create-payment-url',createPayUrl.createPaymentUrlOrder)
router.post('/apply-voucher',orderController.applyVoucher)
//Admin
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_ORDER),orderController.updateOrder)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_ORDER),orderController.deleteOrder)
router.put('/:id/status',checkPermission(PERMISSIONS.UPDATE_STATUS_ORDER),orderController.updateStatusOrder)
router.put('/:id/ship',checkPermission(PERMISSIONS.UPDATE_STATUS_ORDER_SHIP),orderController.updateStatusShipment)

module.exports = router