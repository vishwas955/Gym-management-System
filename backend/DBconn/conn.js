const mongoose = require("mongoose");
require('dotenv').config()


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("The Data base is successfully connected!"))
.catch(err => {
    console.log(err);
});