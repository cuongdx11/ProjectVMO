const router = require('express').Router();
const authController = require('../controllers/authController')

//Public
router.post('/register',authController.register)
router.post('/login',authController.login)
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password',authController.forgotPass)
router.post('/reset-password',authController.resetPass)

//User
router.get('/logout',authController.logout)
router.post('/refresh-token',authController.refreshToken)
module.exports = router