const express = require('express');
const router = express.Router();
const Paymentcontroller = require('../controller/payment');
const auth = require('../middlewares/auth');


router.post('/add-payment',auth.auth, Paymentcontroller.createPayment );
router.get('/get-payment',auth.IsAdminAuth, Paymentcontroller.getPayments);
router.get('/get-user-payment',auth.auth, Paymentcontroller.getPaymentsByUserId);

module.exports = router;