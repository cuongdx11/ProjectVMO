const router = require('express').Router();

const category = require('../controllers/categoryController')

router.get('/list',category.getCategories)
router.get('/:id',category.getCategoryById)
router.put('/:id',category.updateCategory)
router.delete('/:id',category.deleteCategory)
router.post('/',category.createCategory)


module.exports = router