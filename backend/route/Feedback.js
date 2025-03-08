const express = require('express');
const router = express.Router();
const Feedbackcontroller = require('../controller/feedback');
const auth = require('../middlewares/auth');


router.post('/add-feedback',auth.auth, Feedbackcontroller.createFeedback);
router.delete('/delete-feedback/:id',auth.IsAdminAuth, Feedbackcontroller.deleteFeedback );
router.get('/get-feedback',auth.auth, Feedbackcontroller.getAllFeedbacks);


module.exports = router;