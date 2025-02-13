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


app.listen(Port,() => {
    console.log("The Server is runing perfectly!");
});
