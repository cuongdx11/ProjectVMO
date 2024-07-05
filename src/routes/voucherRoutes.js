const router = require('express').Router();

const voucherController = require('../controllers/voucherController')


router.get('/available',voucherController.getVoucherAvailable)
router.get('/validate',voucherController.checkVoucher)
router.post('/',voucherController.createVoucher)
router.get('/:id',voucherController.getVoucherById)
router.put('/:id',voucherController.updateVoucher)
router.delete('/:id',voucherController.deleteVoucher)

module.exports = router