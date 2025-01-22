const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

Port = 4000;

app.use(cookieParser());
app.use(express.json());
require("./DBconn/conn");

const GymMemberroutes = require('./route/GymMember');
app.use('/auth/GymMember',GymMemberroutes);

const Trainerroutes = require('./route/Trainer');
app.use('/auth/Trainer',Trainerroutes);


app.listen(Port,() => {
    console.log("The Server is runing perfectly!");
});
