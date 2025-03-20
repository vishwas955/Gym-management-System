const express = require('express');
const router = express.Router();
const Usercontroller = require('../controller/User');
const Feedbackcontroller = require('../controller/feedback');
const auth = require('../middlewares/auth');

router.put('/assign-trainer/:memberId',auth.IsAdminAuth,Usercontroller.assignTrainer); /*Route to Assign the Trainer
    User Cotroller */
router.get('/get-assigned-trainers/:memberId',auth.auth,Usercontroller.getAssignedTrainers); /* Route to Get all the assigned Trainer
    User Controller*/
router.get('/get-User-trainer',auth.auth,Usercontroller.getAssignedUserTrainer); /* Route to Get the assigned Trainer of a Particular Gym-Member
User Controller*/
router.get('/get-trainers',auth.IsAdminAuth,Usercontroller.GetAllTrainer); /*Fetches all the Trainer data
    User Cotroller */
router.get('/get-assigned-members',auth.auth,Usercontroller.getAssignedMembers); /*Fetches all the Assigned Membe data
    User Cotroller */
router.get('/get-trainer-feedback',auth.IsTrainerAuth, Feedbackcontroller.getTrainerFeedbacks);
router.get('/profile',auth.IsTrainerAuth, Usercontroller.getTrainerProfile);
router.put('/update-profile',auth.IsTrainerAuth, Usercontroller.UpdateTrainerProfile);
module.exports = router;
