const express = require('express');
const router = express.Router();
const Paymentcontroller = require('../controller/payment');
const auth = require('../middlewares/auth');


router.post('/add-payment',auth.auth, Paymentcontroller.createPayment );
// router.delete('/delete-feedback/:id',auth.IsAdminAuth, Paymentcontroller. );
router.get('/get-payment',auth.IsAdminAuth, Paymentcontroller.getPayments);

module.exports = router;