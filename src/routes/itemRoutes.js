const router = require('express').Router();
const itemController = require('../controllers/itemController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const flashSaleItemMiddlewares = require('../middlewares/flashSaleItemMiddleWares')
const upload = require('../middlewares/uploadImageMiddleware')

//Public
// router.get('/list',itemController.listItem)
router.get('/',itemController.listItemById)
router.get('/:id',flashSaleItemMiddlewares.flashSaleItem,itemController.itemById)

//Admin
router.post('/',[authMiddleware.authenticateToken,adminMiddleware.isAdmin],upload.uploadImageItem,itemController.createItem)
router.put('/:id',upload.uploadImageItem,itemController.updateItem)
router.delete('/:id',itemController.deleteItem)

module.exports = router