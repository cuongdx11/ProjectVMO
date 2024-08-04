const router = require('express').Router();
const rolePermissionController = require('../controllers/rolePermissionController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const PERMISSIONS = require('../constants/permissions');



router.use(authenticateToken)

router.get('/:roleId',checkPermission(PERMISSIONS.VIEW_ROLE_PERMISSION),rolePermissionController.getRolePermissionByRoleId)
router.post('/:roleId',checkPermission(PERMISSIONS.UPDATE_ROLE_PERMISSION),rolePermissionController.updateRolePermission)
router.delete('/:roleId',checkPermission(PERMISSIONS.DELETE_ROLE_PERMISSION),rolePermissionController.deleteRolePermission)


module.exports = router