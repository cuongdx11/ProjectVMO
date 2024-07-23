const router = require('express').Router();
const roleController = require('../controllers/roleController')
const roleValidate = require('../validations/roleValidation')

router.post('/',roleValidate,roleController.createRole)
router.get('/:id',roleController.getRoleById)

module.exports = router