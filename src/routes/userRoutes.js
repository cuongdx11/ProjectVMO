const router = require('express').Router();
const user = require('../controllers/userController')
const authenticateToken = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')

//verifytoken
router.use(authenticateToken.authenticateToken)
//route cu the
router.get('/my-orders', user.getOrdersForUser)
router.post('/change-password',user.changePass)
//routes dong
router.get('/' ,[adminMiddleware.isAdmin],user.getUsers)
router.get('/:id',user.getUserById)
router.post('/',[adminMiddleware.isAdmin],user.createUser)
router.put('/:id',user.updateUser)
router.delete('/:id',[adminMiddleware.isAdmin],user.deleteUser)


module.exports = router