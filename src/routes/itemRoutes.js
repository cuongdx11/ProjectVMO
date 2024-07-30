const router = require('express').Router();
const itemController = require('../controllers/itemController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const flashSaleItemMiddlewares = require('../middlewares/flashSaleItemMiddleware')
const upload = require('../middlewares/uploadImageMiddleware')
const PERMISSIONS = require('../constants/permissions')
const multer = require('multer'); 
const storage = multer.memoryStorage();
const uploadExcel = multer({ storage: storage });
//Public
// router.get('/list',itemController.listItem)
router.get('/:id',flashSaleItemMiddlewares.flashSaleItem,itemController.itemById)
router.use(authenticateToken)
router.post('/upload-excel',checkPermission(PERMISSIONS.CREATE_ITEM_EXCEL),uploadExcel.single('file'),itemController.createItemsFromExcel)

router.get('/',checkPermission(PERMISSIONS.VIEW_ITEMS),itemController.listItemById)

//Admin
router.post('/',checkPermission(PERMISSIONS.CREATE_ITEM),upload.uploadImageItem,itemController.createItem)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_ITEM),upload.uploadImageItem,itemController.updateItem)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_ITEM),itemController.deleteItem)

module.exports = router