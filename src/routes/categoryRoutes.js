const router = require('express').Router();
const upload = require('../middlewares/uploadImageMiddleware')
const category = require('../controllers/categoryController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')

//Public
router.get('/',category.getCategories)
router.get('/:id',category.getCategoryById)

//Admin
router.put('/:id',upload.uploadImageCategory,category.updateCategory)
router.delete('/:id',category.deleteCategory)
router.post('/',[authMiddleware.authenticateToken,adminMiddleware.isAdmin],upload.uploadImageCategory,category.createCategory)


module.exports = router