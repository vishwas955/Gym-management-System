const express = require("express");
const mongoose = require("mongoose");


const app = express();

require("./DBconn/conn");
Port = 3000;


app.listen(Port,() => {
    console.log("The Server is runing perfectly!");x
});