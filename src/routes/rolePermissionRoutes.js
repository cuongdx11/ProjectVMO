const router = require('express').Router();
const rolePermissionController = require('../controllers/rolePermissionController')

router.get('/:roleId',rolePermissionController.getRolePermissionByRoleId)
router.post('/:roleId',rolePermissionController.updateRolePermission)
router.delete('/:roleId',rolePermissionController.deleteRolePermission)


module.exports = router