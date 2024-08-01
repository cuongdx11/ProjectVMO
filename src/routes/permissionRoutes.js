const router = require('express').Router();
const permissionController = require('../controllers/permissionController')
const permissionValidate = require('../validations/permissionValidation')




router.post('/',permissionValidate,permissionController.createPermission)
router.get('/',permissionController.getAllPermission)
router.get('/:id',permissionController.getPermissionById)
router.put('/:id',permissionController.updatePermission)
router.delete('/:id',permissionController.deletePermission)


module.exports = router