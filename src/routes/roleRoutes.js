const router = require('express').Router();
const roleController = require('../controllers/roleController')
const roleValidate = require('../validations/roleValidation')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const PERMISSIONS = require('../constants/permissions');


router.use(authenticateToken)

router.post('/',checkPermission(PERMISSIONS.CREATE_ROLE),roleValidate,roleController.createRole)
router.get('/',checkPermission(PERMISSIONS.VIEW_ROLES),roleController.getAllRole)
router.get('/:id',checkPermission(PERMISSIONS.VIEW_ROLE),roleController.getRoleById)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_ROLE),roleController.updateRole)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_ROLE),roleController.deleteRole)


module.exports = router