const router = require('express').Router();
const permissionController = require('../controllers/permissionController')
const permissionValidate = require('../validations/permissionValidation')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const PERMISSIONS = require('../constants/permissions');



router.use(authenticateToken)

router.post('/',checkPermission(PERMISSIONS.CREATE_PERMISSION),permissionValidate,permissionController.createPermission)
router.get('/',checkPermission(PERMISSIONS.VIEW_PERMISSIONS),permissionController.getAllPermission)
router.get('/:id',checkPermission(PERMISSIONS.VIEW_PERMISSION),permissionController.getPermissionById)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_PERMISSION),permissionController.updatePermission)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_PERMISSION),permissionController.deletePermission)


module.exports = router