const express = require('express');
const router = express.Router();
const Usercontroller = require('../controller/User');


router.post('/register',Usercontroller.register);
router.post('/login',Usercontroller.login);

module.exports = router;