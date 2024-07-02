const router = require('express').Router();
const itemController = require('../controllers/itemController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const upload = require('../middlewares/uploadImageMiddleware')
// router.get('/list',itemController.listItem)
router.get('/',itemController.listItemById)
router.get('/:id',itemController.itemById)
router.post('/',[authMiddleware.authenticateToken,adminMiddleware.isAdmin],upload,itemController.createItem)
router.put('/:id',itemController.updateItem)
router.delete('/:id',itemController.deleteItem)

module.exports = router