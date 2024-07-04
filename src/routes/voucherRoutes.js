const router = require('express').Router();

const voucherController = require('../controllers/voucherController')


router.get('/available',voucherController.getVoucherAvailable)
router.get('/validate',voucherController.checkVoucher)

module.exports = router