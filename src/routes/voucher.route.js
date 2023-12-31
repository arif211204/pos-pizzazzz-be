const router = require('express').Router();
const verifyUserAuth = require('../middlewares/auth/verifyUserAuth');
const { voucherValidator } = require('../middlewares/validators');
const { voucherController } = require('../controllers');

// GET vouchers
router.get(
  '/',
  verifyUserAuth({ isAdmin: true, isCashier: true }),
  voucherController.getVouchers
);

// POST create new voucher
router.post(
  '/',
  verifyUserAuth({ isAdmin: true }),
  voucherValidator.createVoucher,
  voucherController.createVoucher
);

module.exports = router;
