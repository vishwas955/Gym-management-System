const express = require('express');
const router = express.Router();
const Usercontroller = require('../controller/User');
const Auth = require('../middlewares/auth');


router.post('/register',Usercontroller.register);  //Register route 
router.post('/login',Usercontroller.login);  //login route
router.post('/logout',Usercontroller.logout);  //log-out route
router.get("/token-verification",Auth.auth,(req, res) => {
    res.json({ role: req.user.role }); // `req.user` is now available
  });
router.post('/forgot-password',Usercontroller.forgotPassword); //Forget Password route
router.post('/reset-password',Usercontroller.resetPassword);  //Reset Password route 
router.get('/get-users',Auth.auth,Usercontroller.GetAllUser); //fetch all the Gym Members from DB
router.get('/get-profile',Auth.auth,Usercontroller.getUserProfile); //fetch the Gym-Member profile 
router.put('/update-Profile',Auth.auth,Usercontroller.UpdateUserProfile); //Update the Gym-Member profile

module.exports = router;
