const router = require('express').Router();
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middlewares/authMiddleware')


router.use(authMiddleware.authenticateToken)
router.post('/',orderController.createOrder)
router.get('/:id',orderController.getOrderById)
router.put('/:id',orderController.updateOrder)
router.delete('/:id',orderController.deleteOrder)

module.exports = router