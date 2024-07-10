const router = require('express').Router();
const permissionController = require('../controllers/permissionController')


router.post('/',permissionController.createPermission)


module.exports = router