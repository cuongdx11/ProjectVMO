const router = require('express').Router();
const flashSaleController = require('../controllers/flashSaleController')
const flashSaleValidate = require('../validations/flashSaleValidation')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const PERMISSIONS = require('../constants/permissions')


//Public
router.get('/active',flashSaleController.getActiveFlashSales)
router.get('/:id',flashSaleController.getFlashSaleById)
router.get('/:id/items',flashSaleController.getFlashSaleItem)
router.get('/:id/items/:item_id',flashSaleController.getFlashSaleItemById)

//Admin
router.use(authenticateToken)
router.get('/',checkPermission(PERMISSIONS.VIEW_FLASH_SALES),flashSaleController.getAllFlashSale)
router.post('/',checkPermission(PERMISSIONS.CREATE_FLASH_SALE),flashSaleValidate,flashSaleController.createFlashSale)
router.post('/items',flashSaleController.createFlashSaleItem)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_FLASH_SALE),flashSaleController.updateFlashSale)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_FLASH_SALE),flashSaleController.deleteFlashSale)

module.exports = router
