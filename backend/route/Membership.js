const express = require('express');
const router = express.Router();
const Membershipcontroller = require('../controller/membership');
const auth = require('../middlewares/auth');

router.post('/add-membership',auth.IsAdminAuth,Membershipcontroller.newMembership);
router.put('/update-membership/:id',auth.IsAdminAuth,Membershipcontroller.updateMembership);
router.delete('/delete-membership/:id',auth.IsAdminAuth,Membershipcontroller.disableMembership);
router.get('/get-membership',auth.IsAdminAuth,Membershipcontroller.getMembership);
router.get('/get-user-membership',auth.auth,Membershipcontroller.getUserMembership);
router.put('/update-user-membership',auth.auth,Membershipcontroller.updateUserMembership); 
module.exports = router;