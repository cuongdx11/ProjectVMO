const router = require('express').Router();
const roleController = require('../controllers/roleController')


router.post('/',roleController.createRole)
router.get('/:id',roleController.getRoleById)

module.exports = router