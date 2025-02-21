const express = require('express');
const router = express.Router();
const Subscriptioncontroller = require('../controller/subscription');
const auth = require('../middlewares/auth');


router.post('/add-subscription',auth.IsAdminAuth,Subscriptioncontroller.addsubscription);
<<<<<<< HEAD
router.put('/update-subscription/:id',auth.IsAdminAuth,Subscriptioncontroller.UpdateSubscription);
router.delete('/delete-subscription/:id',auth.IsAdminAuth,Subscriptioncontroller.deleteSubscription);
=======
router.put('/update-subscription',auth.IsAdminAuth,Subscriptioncontroller.UpdateSubscription);
router.delete('/delete-subscription',auth.IsAdminAuth,Subscriptioncontroller.deleteSubscription);
>>>>>>> be89ed79ae96f310cce4fdf4460d1d1022292e25
router.get('/get-subscription',auth.auth,Subscriptioncontroller.getSubscription);

module.exports = router;
