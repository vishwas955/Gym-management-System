const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Caliber_fitness_gms")
.then(() => console.log("The Data base is successfully connected!"))
.catch(err => {
    console.log(err);
});