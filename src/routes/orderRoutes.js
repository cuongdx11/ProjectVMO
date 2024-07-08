const router = require('express').Router();
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middlewares/authMiddleware')
const createPayUrl = require('../helpers/createPaymentUrl')

router.use(authMiddleware.authenticateToken)
router.post('/',orderController.createOrder)
router.get('/:id/cancel',orderController.cancelledOrder)
router.get('/:id',orderController.getOrderById)
router.put('/:id',orderController.updateOrder)
router.delete('/:id',orderController.deleteOrder)
router.post('/create-payment-url',createPayUrl.createPaymentUrlOrder)

module.exports = router