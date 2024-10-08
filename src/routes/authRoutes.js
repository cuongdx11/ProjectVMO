const router = require('express').Router();
const authController = require('../controllers/authController')
const authValidate = require('../validations/authValidation')
const {authenticateToken} = require('../middlewares/authMiddleware')
//Public
router.post('/register',authValidate.validateAuthRegister,authController.register)
router.post('/login',authValidate.validateAuthLogin,authController.login)
router.get('/verify-email', authController.verifyEmail);
router.get('/verify-invitation',authController.verifyInvitationEmail)
router.post('/forgot-password',authValidate.validateAuthForgotPass,authController.forgotPass)
router.post('/reset-password',authController.resetPass)
router.post('/refresh-token',authController.refreshToken)
//User
router.use(authenticateToken)
router.get('/logout',authController.logout)
router.post('/change-password',authValidate.validateAuthChangePass,authController.changePass)
module.exports = router