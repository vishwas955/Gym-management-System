const express = require('express');
const router = express.Router();
const Trainercontroller = require('../controller/Trainer');


router.post('/register',Trainercontroller.register);
router.post('/login',Trainercontroller.login);

module.exports = router;