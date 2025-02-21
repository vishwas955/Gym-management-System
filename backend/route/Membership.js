<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const Membershipcontroller = require('../controller/membership');
const auth = require('../middlewares/auth');

router.post('/add-membership',auth.IsAdminAuth,Membershipcontroller.newMembership);
router.put('/update-membership/:id',auth.IsAdminAuth,Membershipcontroller.updateMembership);
router.delete('/delete-membership/:id',auth.IsAdminAuth,Membershipcontroller.disableMembership);
router.get('/get-membership',auth.IsAdminAuth,Membershipcontroller.getMembership);

=======
const express = require('express');
const router = express.Router();
const Membershipcontroller = require('../controller/membership');
const auth = require('../middlewares/auth');

router.post('/add-membership',auth.IsAdminAuth,Membershipcontroller.newMembership);
router.put('/update-membership/:id',auth.IsAdminAuth,Membershipcontroller.updateMembership);
router.delete('/delete-membership/:id',auth.IsAdminAuth,Membershipcontroller.disableMembership);
router.get('/get-membership',auth.IsAdminAuth,Membershipcontroller.getMembership);

>>>>>>> be89ed79ae96f310cce4fdf4460d1d1022292e25
module.exports = router;