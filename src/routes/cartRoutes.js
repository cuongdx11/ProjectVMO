const router = require('express').Router();
const cartController = require('../controllers/cartController')
const authMiddleware = require('../middlewares/authMiddleware')
const cartMiddleware = require('../middlewares/cartMiddleware')


router.post('/',cartController.createCart)
router.use(authMiddleware.authenticateToken)
router.use(cartMiddleware.cartTransferMiddleware)
router.get('/',cartController.getCartByUser)

module.exports = router