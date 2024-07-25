const router = require('express').Router();
const userRoleController = require('../controllers/userRoleController')

router.get('/:id',userRoleController.getUserRoleByUserId)
router.post('/',userRoleController.createUserRole)
router.put('/:userId',userRoleController.updatedUserRole)
router.delete('/:id',userRoleController.deleteUserRole)





module.exports = router