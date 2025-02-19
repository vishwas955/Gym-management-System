const express = require('express');
const router = express.Router();
const Subscriptioncontroller = require('../controller/subscription');
const auth = require('../middlewares/auth');


router.post('/add-subscription',auth.IsAdminAuth,Subscriptioncontroller.addsubscription);
router.put('/update-subscription',auth.IsAdminAuth,Subscriptioncontroller.UpdateSubscription);
router.delete('/delete-subscription',auth.IsAdminAuth,Subscriptioncontroller.deleteSubscription);
router.get('/get-subscription',auth.auth,Subscriptioncontroller.getSubscription);

module.exports = router;
