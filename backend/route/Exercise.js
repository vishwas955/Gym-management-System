const express = require('express');
const router = express.Router();
const Exercisecontroller = require('../controller/Exercise');
const auth = require('../middlewares/auth');

router.post('/add-exercise',auth.IsAdminAuth, Exercisecontroller.createExercise );
router.put('/update-exercise/:id',auth.IsAdminAuth, Exercisecontroller.updateExercise );
router.delete('/delete-exercise/:id',auth.IsAdminAuth, Exercisecontroller.deleteExercise );
router.get('/get-exercise',auth.auth , Exercisecontroller.getExercises );

module.exports = router;