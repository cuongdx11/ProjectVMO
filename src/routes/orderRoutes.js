const router = require('express').Router();
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middlewares/authMiddleware')


router.use(authMiddleware.authenticateToken)
router.post('/',orderController.createOrder)

module.exports = router