const router = require('express').Router();
const itemController = require('../controllers/itemController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const flashSaleItemMiddlewares = require('../middlewares/flashSaleItemMiddleware')
const upload = require('../middlewares/uploadImageMiddleware')
const PERMISSIONS = require('../constants/permissions')
const multer = require('multer'); 
const storage = multer.memoryStorage();
const uploadExcel = multer({ storage: storage });
//Public
// router.get('/list',itemController.listItem)
router.post('/upload-excel',uploadExcel.single('file'),itemController.createItemsFromExcel)

router.get('/',itemController.listItemById)
router.get('/:id',flashSaleItemMiddlewares.flashSaleItem,itemController.itemById)
//Admin
router.post('/',[authMiddleware.authenticateToken,authMiddleware.checkPermission(PERMISSIONS.CREATE_ITEM)],upload.uploadImageItem,itemController.createItem)
router.put('/:id',upload.uploadImageItem,itemController.updateItem)
router.delete('/:id',itemController.deleteItem)

module.exports = router