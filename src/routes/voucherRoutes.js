const router = require('express').Router();

const voucherController = require('../controllers/voucherController')
const voucherValidate = require('../validations/voucherValidation')
const {authenticateToken,checkPermission} = require('../middlewares/authMiddleware')
const PERMISSIONS = require('../constants/permissions');

//Public
router.get('/available',voucherController.getVoucherAvailable)
router.get('/validate',voucherController.checkVoucher)
router.get('/:id',voucherController.getVoucherById)

//Admin
router.get('/',voucherController.getAllVoucher)
router.use(authenticateToken)
router.post('/',checkPermission(PERMISSIONS.CREATE_VOUCHER),voucherValidate,voucherController.createVoucher)
router.put('/:id',checkPermission(PERMISSIONS.UPDATE_VOUCHER),voucherController.updateVoucher)
router.delete('/:id',checkPermission(PERMISSIONS.DELETE_VOUCHER),voucherController.deleteVoucher)

module.exports = router