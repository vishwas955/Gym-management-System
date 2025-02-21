const express = require('express');
const router = express.Router();
const FAQcontroller = require('../controller/FAQ');
const auth = require('../middlewares/auth');


router.post('/add-faq',auth.IsAdminAuth, FAQcontroller.createFAQ );
router.put('/update-faq/:id',auth.IsAdminAuth, FAQcontroller.updateFAQ );
router.delete('/delete-faq/:id',auth.IsAdminAuth, FAQcontroller.deleteFAQ );
router.get('/get-faq',auth.auth, FAQcontroller.getAllFAQs);

module.exports = router;