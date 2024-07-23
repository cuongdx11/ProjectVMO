const router = require('express').Router();

const voucherController = require('../controllers/voucherController')
const voucherValidate = require('../validations/voucherValidation')

//Public
router.get('/available',voucherController.getVoucherAvailable)
router.get('/validate',voucherController.checkVoucher)
router.get('/:id',voucherController.getVoucherById)

//Admin
router.post('/',voucherValidate,voucherController.createVoucher)
router.put('/:id',voucherController.updateVoucher)
router.delete('/:id',voucherController.deleteVoucher)

module.exports = router