const Trainer = require('../model/trainer_model');
const bcrypt = require('bcryptjs');
exports.register = async (req,res) => {
    try{
        const {username,email,password,phone_number,dob} = req.body;
        
        //finding the same username 
        const isExistusername = await Trainer.findOne({username});
        const isExistemail = await Trainer.findOne({email});

        if (isExistusername){
            res.status(400).json({
                error:"Username already exists"
            });
        }
        else if (isExistemail) {
            res.status(400).json({
                error:"Email already exists!"
            });
        }
        else{

            const hasedPassword = await bcrypt.hash(password,10);

            //adding the data to the database 
            const newTrainer = new Trainer({username,email, password : hasedPassword ,phone_number,dob});
            await newTrainer.save();
           
            res.status(201).json({ message:"Trainer Registered Successfully", success:"true",data:newTrainer });
        }
    }catch(err){
        res.status(500).json({
            error:"Server Error i dont know what "
        });
    }
}

//login function 
exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
        const emailexists = await Trainer.findOne({email});

        if (emailexists && await bcrypt.compare(password,emailexists.password)){
           res.status(201).json({ message:"Trainer Logged in Successfully!", success:"true" });
        }
        else if (emailexists.is_admin){
            res.status(201).json({message:"Admin Logged in succesfully!", success:"true"});
        }
        else{
            res.status(400).json({ error:"Invalid Credentials!"});
        }

    }catch(err){
        res.status(500).json({
            error:"Server Error i dont know what "
        });
    }
}