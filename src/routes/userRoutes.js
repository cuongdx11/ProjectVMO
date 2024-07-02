const router = require('express').Router();
const user = require('../controllers/userController')
const authenticateToken = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')


router.use(authenticateToken.authenticateToken)
router.get('/' ,[adminMiddleware.isAdmin],user.getUsers)
router.get('/:id',user.getUserById)
router.post('/change-password',user.changePass)
router.post('/',[adminMiddleware.isAdmin],user.createUser)
router.put('/:id',user.updateUser)
router.delete('/:id',[adminMiddleware.isAdmin],user.deleteUser)

module.exports = router