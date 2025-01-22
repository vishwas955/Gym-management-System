const GymMember = require('../model/gym_member_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req,res) => {
    try{
        const {username,email,password,phone_number,dob} = req.body;
        
        //finding the same username 
        const isExistusername = await GymMember.findOne({username});
        const isExistemail = await GymMember.findOne({email});

        if (isExistusername){
            return res.status(400).json({
                error:"Username already Exists!"
            });
        }
        else if (isExistemail){
            return res.status(400).json({
                error:"Email already Exists!"
            });
        }
        else{

            const hasedPassword = await bcrypt.hash(password,10);

            //adding the data to the database 
            const newGymMember = new GymMember({username,email, password : hasedPassword ,phone_number,dob});
            await newGymMember.save();
           
            res.status(201).json({ message:"User Registered Successfully", success:"yes",data:newGymMember });
        }
    }catch(err){
        console.error("Error during registration:", err);
        res.status(500).json({
            error: "An unexpected error occurred. Please try again later."
        });
    }
}

//login function 
exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
        const emailexists = await GymMember.findOne({email});

        if (emailexists && await bcrypt.compare(password,emailexists.password)){
           // const token = jwt.sign(
               // { gym_member_id: emailexists._id, email: emailexists.email },
                //process.env.JWT_SecretKey, // Use a secure secret key from your environment variables
                //{ expiresIn: '1h' } // Token expiration time
            //);
            res.status(200).json({ 
                message: "User Logged in Successfully!", 
                success: "true", 
               // token, // Include the token in the response
                user: {
                    gym_member_id: emailexists._id,
                    username: emailexists.username,
                    email: emailexists.email,
                    //first_name: emailexists.first_name,
                    //last_name: emailexists.last_name,
                }
            });
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