const User = require('../model/User_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const SendEmail = require('../utils/SendEmail');




//Logout function 
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
        const {email,password,role} = req.body;
        const emailexists = await User.findOne({email});

        if (emailexists && await bcrypt.compare(password,emailexists.password)){
           const token = jwt.sign(
               { User_id: emailexists._id, email: emailexists.email, role: emailexists.role},
                process.env.JWT_SecretKey, // Use a secure secret key from your environment variables
                { expiresIn: '1h' } // Token expiration time
            );
            res.cookie("cookie_token",token,cookieOptions)
            if (role===emailexists.role){
                return res.status(200).json({ 
                    message: `${emailexists.role} Logged in Successfully!`, 
                    success: "true", 
                   token, // Include the token in the response
                    user: {
                        User_id: emailexists._id,
                        email: emailexists.email,
                        first_name: emailexists.first_name,
                        last_name: emailexists.last_name,
                        role: emailexists.role,
                    }
                });
            }
            else{
                res.status(400).json({ error:"Invalid Usertype!"});
            }
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



//Logout function 
exports.logout = async (req,res) => {
    res.clearCookie('cookie_token', cookieOptions).json({message:'Logged out Successfully!'});
}



//Forgot password function 
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!", success: false });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(32).toString("hex");
        console.log(resetToken);
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Store in DB
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Fix: Correct reset URL
        const resetUrl = `${process.env.REACT_APP_FRONTEND_URL}?token=${resetToken}`;

        // Fix: Correct Email Template Formatting
        const emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
                .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                .header { background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .content a { display: inline-block; background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; }
                .footer { background-color: #f1f1f1; color: #666; text-align: center; padding: 15px; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header"><h1>Caliber Fitness</h1></div>
                <div class="content">
                    <h3>Reset Your Password</h3>
                    <p>Forgot your password don't worry Caliber Fitness is there for you 24/7. Click the link below to reset your password:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>Need more help? <a href="mailto:info@caliberfitness.com">Contact Support</a></p>
                    <p>&copy; ${new Date().getFullYear()} Caliber Fitness. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;

        // Send Email
        await SendEmail.sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            html: emailContent,
        });

        res.status(200).json({ message: "Password reset link has been sent to your email!", success: true });

    } catch (error) {
        console.error("Error during forgotPassword:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};




// Reset Password function
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.status(200).json({
            message: "Password has been updated successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error during resetPassword:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};



//Get All User that are registered
exports.GetAllUser = async (req,res) => {
    try { 
        //Fetch Users whose role is User 
        const users = await User.find({role : 'Member'}, "first_name last_name email _id"); // Fetch only necessary fields
        res.json(users);
    } catch (error) {
        console.error("Error during resetPassword:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
}



//Get All the Trainer that are registered
exports.GetAllTrainer = async (req,res) => {
    try { 
        //Fetch Users whose role is Trainer 
        const users = await User.find({role : 'Trainer'}, "first_name last_name email _id"); // Fetch only necessary fields
        res.json(users);
    } catch (error) {
        console.error("Error during resetPassword:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
}



//Assign Trainer to the Particular Gym-Member 
exports.assignTrainer = async (req,res) => {
    try {
        const memberId = req.params.memberId; // Get member ID from URL params
        const { trainerId } = req.body; // Trainer ID from request body

        console.log("Assigning trainer:", trainerId, "to member:", memberId);

        // Check if the member exists and is a "Member"
        const member = await User.findOne({ _id: memberId, role: "Member" });
        if (!member) {
            return res.status(404).json({ error: "Member not found or not a valid member" });
        }

        // Check if the trainer exists and is actually a trainer
        const trainer = await User.findOne({ _id: trainerId, role: "Trainer" });
        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found or not a valid trainer" });
        }

        // Assign the trainer to the member
        member.trainer_id = trainerId;
        await member.save();

        res.status(200).json({ message: "Trainer assigned successfully!", member });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error!', success : false
        });
    }
}



//View Assigned Trainer to all Members
exports.getAssignedTrainers = async (req, res) => {
    try {
        const membersWithTrainers = await User.find({ role: "Member", trainer_id: { $ne: null } }) 
            .populate("trainer_id", "first_name last_name email") // Fetch trainer details (name, email)
            .select("first_name last_name email trainer_id"); // Select relevant fields

        if (membersWithTrainers.length === 0) {
            return res.status(404).json({ error: "No members with assigned trainers found" });
        }

        res.status(200).json(membersWithTrainers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error!', success : false
        });
    }
<<<<<<< HEAD
};
=======
};
>>>>>>> be89ed79ae96f310cce4fdf4460d1d1022292e25
