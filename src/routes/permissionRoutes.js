const router = require('express').Router();
const permissionController = require('../controllers/permissionController')
const permissionValidate = require('../validations/permissionValidation')

router.post('/',permissionValidate,permissionController.createPermission)


module.exports = router