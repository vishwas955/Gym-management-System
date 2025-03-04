const express = require('express');
const router = express.Router();
const Usercontroller = require('../controller/User');
const auth = require('../middlewares/auth');

router.put('/assign-trainer/:memberId',auth.IsAdminAuth,Usercontroller.assignTrainer); /*Route to Assign the Trainer
    User Cotroller */
router.get('/get-assigned-trainers/:memberId',auth.IsAdminAuth,Usercontroller.getAssignedTrainers); /* Route to Get all the assigned Trainer
    User Controller*/
router.get('/get-trainers',auth.IsAdminAuth,Usercontroller.GetAllTrainer); /*Fetches all the Trainer data
    User Cotroller */
router.get('/get-assigned-members',auth.auth,Usercontroller.getAssignedMembers); /*Fetches all the Assigned Membe data
    User Cotroller */
module.exports = router;