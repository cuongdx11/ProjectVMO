const router = require('express').Router();
const user = require('../controllers/userController')
const authenticateToken = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const uploadAvatar = require('../middlewares/uploadImageMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const PERMISSIONS = require('../constants/permissions')
const validateUser = require('../validations/userValidation')
router.use(authenticateToken.authenticateToken)

//User
router.get('/my-orders', user.getOrdersForUser)
router.post('/change-password',user.changePass)

//Admin
router.get('/' ,authMiddleware.checkPermission(PERMISSIONS.VIEW_USERS),user.getUsers)
router.post('/',[adminMiddleware.isAdmin],uploadAvatar.uploadImageAvatar,validateUser,user.createUser)
router.delete('/:id',[adminMiddleware.isAdmin],user.deleteUser)

//User or Admin
router.get('/:id',user.getUserById)
router.put('/:id',uploadAvatar.uploadImageAvatar,user.updateUser)



module.exports = router