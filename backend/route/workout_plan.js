const express = require('express');
const router = express.Router();
const WO_Plancontroller = require('../controller/workout_plan');
const Usercontroller = require('../controller/User');
const auth = require('../middlewares/auth');

router.post('/add-plan',auth.auth, WO_Plancontroller.createWorkoutPlan );
router.put('/update-plan/:id',auth.auth, WO_Plancontroller.updateWorkoutPlan );
router.delete('/delete-plan/:id',auth.auth, WO_Plancontroller.deleteWorkoutPlan );
router.get('/get-plan',auth.auth , WO_Plancontroller.getWorkoutPlans );
router.get('/get-user-plan',auth.auth , WO_Plancontroller.getUserWorkoutPlan );
router.put('/assign-WOPlan/:userID',auth.auth, Usercontroller.assignWorkoutPlan );

module.exports = router;