const express = require('express');
const router = express.Router();
const Subscriptioncontroller = require('../controller/subscription');
const auth = require('../middlewares/auth');


router.post('/add-subscription',auth.IsAdminAuth,Subscriptioncontroller.addsubscription);

router.put('/update-subscription/:id',auth.IsAdminAuth,Subscriptioncontroller.UpdateSubscription);
router.delete('/delete-subscription/:id',auth.IsAdminAuth,Subscriptioncontroller.deleteSubscription);

router.get('/get-subscription/:id',Subscriptioncontroller.getSubscriptionById);
router.get('/get-subscription',Subscriptioncontroller.getSubscription);

module.exports = router;
