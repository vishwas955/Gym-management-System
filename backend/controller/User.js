const User = require('../model/User_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req,res) => {
    try{
        const {first_name,last_name,gender,role,email,password,phone_number,dob} = req.body;
        
        //finding the ame email
        const isExistemail = await User.findOne({email});

        if (isExistemail){
            return res.status(400).json({
                error:"Email already Exists!"
            });
        }
        else{

            const hasedPassword = await bcrypt.hash(password,10);

            //adding the data to the database 
            const newUser = new User({first_name,last_name,gender,role,email, password : hasedPassword ,phone_number,dob});
            await newUser.save();
           
            res.status(201).json({ message:`${User.role} Registered Successfully`, success:"yes",data:newUser });
        }
    }catch(err){
        console.error("Error during registration:", err);
        res.status(500).json({
            error: "An unexpected error occurred. Please try again later."
        });
    }
}

//cookie options 
const cookieOptions = {
    httpOnly:true,
    secure:false,//true for production 
    sameSite: 'Lax',
};

//login function 
exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
        const emailexists = await User.findOne({email});

        if (emailexists && await bcrypt.compare(password,emailexists.password)){
           const token = jwt.sign(
               { User_id: emailexists._id, email: emailexists.email },
                process.env.JWT_SecretKey, // Use a secure secret key from your environment variables
                { expiresIn: '1h' } // Token expiration time
            );
            res.cookie("cookie_token",token,cookieOptions)
            res.status(200).json({ 
                message: `${emailexists.role} Logged in Successfully!`, 
                success: "true", 
               // token, // Include the token in the response
                user: {
                    User_id: emailexists._id,
                    email: emailexists.email,
                    first_name: emailexists.first_name,
                    last_name: emailexists.last_name,
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