const express = require('express');
const router = express.Router();
const Usercontroller = require('../controller/User');
const auth = require('../middlewares/auth');

router.put('/assign-trainer/:memberId',auth.IsAdminAuth,Usercontroller.assignTrainer);//Route to Assign the Trainer 
router.get('/get-assigned-trainers',auth.IsAdminAuth,Usercontroller.getAssignedTrainers);// Route to Get all the assigned Trainer
router.get('/get-tariners',auth.IsAdminAuth,Usercontroller.GetAllTrainer);// Fetches all the Trainer data

module.exports = router;