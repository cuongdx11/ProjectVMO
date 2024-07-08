const router = require('express').Router();
const user = require('../controllers/userController')
const authenticateToken = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')


router.use(authenticateToken.authenticateToken)

//User
router.get('/my-orders', user.getOrdersForUser)
router.post('/change-password',user.changePass)

//Admin
router.get('/' ,[adminMiddleware.isAdmin],user.getUsers)
router.post('/',[adminMiddleware.isAdmin],user.createUser)
router.delete('/:id',[adminMiddleware.isAdmin],user.deleteUser)

//User or Admin
router.get('/:id',user.getUserById)
router.put('/:id',user.updateUser)



module.exports = router