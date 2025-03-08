const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

app.use(cors({ origin: process.env.REACT_APP_FRONTEND_URL , credentials: true }));

Port = 4000

app.use(cookieParser());
app.use(express.json());
require("./DBconn/conn");

const Userroutes = require('./route/User');
app.use('/auth/User',Userroutes);

const Subscriptionroutes = require('./route/subscription');
app.use('/subscription',Subscriptionroutes);

const MemberShiproutes = require('./route/Membership');
app.use('/membership',MemberShiproutes);

/*
    All the Trainer related in the User Model Route through here 
        - Assign Trainer
        - Get Trainer Data That is assigned
        - Get Trainer Data 
        - View Assigned Member 
        - View Trainer feedback
*/
const TrainerRoutes = require('./route/TrainerRoutes');
app.use('/trainer',TrainerRoutes);

const FAQRoutes = require('./route/FAQ');
app.use('/FAQ', FAQRoutes);

const FeedbackRoutes = require('./route/Feedback');
app.use('/feedback', FeedbackRoutes);

const PaymentRoutes = require('./route/Payment');
app.use('/payment', PaymentRoutes);

const ExerciseRoutes = require('./route/Exercise');
app.use('/exercise', ExerciseRoutes);

//Workout plan endpoints 
const WO_PlanRoutes = require('./route/workout_plan');
app.use('/WO-plan', WO_PlanRoutes);

app.listen(Port,() => {
    console.log("The Server is runing perfectly!");
});
