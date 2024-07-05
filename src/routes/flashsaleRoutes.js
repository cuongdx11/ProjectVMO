const router = require('express').Router();
const flashSaleController = require('../controllers/flashsaleController')


router.post('/',flashSaleController.createFlashSale)
router.post('/items',flashSaleController.createFlashSaleItem)
router.get('/:id',flashSaleController.getFlashSaleById)
router.get('/:id/items',flashSaleController.getFlashSaleItem)
router.get('/:id/items/:item_id',flashSaleController.getFlashSaleItemById)
router.put('/:id',flashSaleController.updateFlashSale)
router.delete('/:id',flashSaleController.deleteFlashSale)

module.exports = router