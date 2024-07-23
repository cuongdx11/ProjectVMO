const router = require('express').Router();
const flashSaleController = require('../controllers/flashSaleController')
const flashSaleValidate = require('../validations/flashSaleValidation')

//Public
router.get('/active',flashSaleController.getActiveFlashSales)
router.get('/:id',flashSaleController.getFlashSaleById)
router.get('/:id/items',flashSaleController.getFlashSaleItem)
router.get('/:id/items/:item_id',flashSaleController.getFlashSaleItemById)

//Admin
router.post('/',flashSaleValidate,flashSaleController.createFlashSale)
router.post('/items',flashSaleController.createFlashSaleItem)
router.put('/:id',flashSaleController.updateFlashSale)
router.delete('/:id',flashSaleController.deleteFlashSale)

module.exports = router
