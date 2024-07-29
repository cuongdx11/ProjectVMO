const router = require('express').Router();
const upload = require('../middlewares/uploadImageMiddleware')
const category = require('../controllers/categoryController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const PERMISSIONS = require('../constants/permissions')
const categoryValidate = require('../validations/categoryValidation')
require('dotenv').config();

//Public
router.get('/',category.getCategories)
router.get('/:id',category.getCategoryById)

//Admin
router.put('/:id/change-position',category.changePosition)
router.put('/:id',upload.uploadImageCategory,category.updateCategory)
router.delete('/:id',category.deleteCategory)
router.post('/',[authMiddleware.authenticateToken,authMiddleware.checkPermission(PERMISSIONS.CREATE_CATEGORY)],upload.uploadImageCategory,categoryValidate,category.createCategory)


module.exports = router