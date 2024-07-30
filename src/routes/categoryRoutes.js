const router = require('express').Router();
const upload = require('../middlewares/uploadImageMiddleware')
const category = require('../controllers/categoryController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const PERMISSIONS = require('../constants/permissions')
const categoryValidate = require('../validations/categoryValidation')
require('dotenv').config();

//Public
router.get('/',category.getCategories)
router.get('/:id',category.getCategoryById)

//Admin
router.use(authenticateToken)
router.put('/:id/change-position',checkPermission(PERMISSIONS.CHANGE_POSITION),category.changePosition)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_CATEGORY),upload.uploadImageCategory,category.updateCategory)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_CATEGORY),category.deleteCategory)
router.post('/',checkPermission(PERMISSIONS.CREATE_CATEGORY),upload.uploadImageCategory,categoryValidate,category.createCategory)


module.exports = router