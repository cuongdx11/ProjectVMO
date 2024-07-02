const router = require('express').Router();
const authController = require('../controllers/authController')

router.post('/register',authController.register)
router.post('/login',authController.login)
router.get('/logout',authController.logout)
router.post('/refresh-token',authController.refreshToken)
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password',authController.forgotPass)
router.post('/reset-password',authController.resetPass)
module.exports = router