const router = require('express').Router();
const userRoleController = require('../controllers/userRoleController')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const PERMISSIONS = require('../constants/permissions');


router.use(authenticateToken)

router.get('/:id',checkPermission(PERMISSIONS.VIEW_USER_ROLE),userRoleController.getUserRoleByUserId)
router.post('/',checkPermission(PERMISSIONS.CREATE_USER_ROLE),userRoleController.createUserRole)
router.put('/:userId',checkPermission(PERMISSIONS.UPDATE_USER_ROLE),userRoleController.updatedUserRole)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_USER_ROLE),userRoleController.deleteUserRole)





module.exports = router