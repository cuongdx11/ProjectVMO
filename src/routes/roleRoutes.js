const router = require('express').Router();
const roleController = require('../controllers/roleController')
const roleValidate = require('../validations/roleValidation')

router.post('/',roleValidate,roleController.createRole)
router.get('/',roleController.getAllRole)
router.get('/:id',roleController.getRoleById)
router.put('/:id',roleController.updateRole)
router.delete('/:id',roleController.deleteRole)


module.exports = router