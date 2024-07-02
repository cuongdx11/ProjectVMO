const router = require('express').Router();
const flashSaleController = require('../controllers/flashsaleController')


router.post('/',flashSaleController.createFlashSale)
router.post('/items',flashSaleController.createFlashSaleItem)


module.exports = router