const express = require('express');
const router = express.Router();
const GymMembercontroller = require('../controller/GymMember');


router.post('/register',GymMembercontroller.register);
router.post('/login',GymMembercontroller.login);

module.exports = router;