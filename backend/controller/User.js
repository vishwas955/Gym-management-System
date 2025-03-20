const User = require('../model/User_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const SendEmail = require('../utils/SendEmail');
const WorkoutPlan = require('../model/workout_plan_model');
const e = require('express');
const Membership = require('../model/membership_model')



//Register The User
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
        const resetUrl = `${process.env.REACT_APP_FRONTEND_URL}/resetpassword?token=${resetToken}`;

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
exports.GetAllUser = async (req, res) => {
    try { 
        // Fetch all users with role "Member"
        const users = await User.find({ role: 'Member' }, "first_name last_name email _id createdAt");

        // Fetch membership details for these users
        const memberships = await Membership.find({ gymMemberId: { $in: users.map(user => user._id) } }, "gymMemberId status");

        // Create a mapping of user IDs to membership status
        const membershipMap = {};
        memberships.forEach(membership => {
            membershipMap[membership.gymMemberId.toString()] = membership.status;
        });

        // Attach membership status to each user
        const usersWithMembershipStatus = users.map(user => ({
            ...user._doc,
            membershipStatus: membershipMap[user._id.toString()] || "No Membership"
        }));

        // Send the response
        res.json(usersWithMembershipStatus);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};



//Get Particular Gym-Member Profile
exports.getUserProfile = async (req,res) => {
    try {
        const { _id, role } = req.user;
        
        //Verify the User is Trainer 
        if ( role !== "Member"){
            return res.status(403).json({ message : "Access Denied Only Gym-Member can access their Profile!", success : false });
        }

        const gymMemberProfile = await User.findOne({ _id, role : "Member" })
        .select("first_name last_name email phone_number dob gender address height weight ");

        if (!gymMemberProfile){
            return res.status(404).json({
                message: "Gym-Member profile not found.",
                success: false
            });
        }
        
        res.status(200).json({ message : 'Gym-Member Profile Data fetched Successfully!', success : true, gymMemberProfile });
    } catch (error) {
        console.error("Error during fetching Gym-Member Data:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
}



//Update Gym-Member Profile 
exports.UpdateUserProfile = async (req,res) => {
    try {
        const { _id, role } = req.user;
        const { height, weight, phone_number, first_name, last_name} = req.body;

        //Verify the User is Trainer
        if(role !== "Member"){
            return res.status(403).json({ message : "Access Denied Only Gym-Member can access their Profile!", success : false });
        }

        const gymMemberInfo = await User.findOne({_id, role : "Member"});

        if (!gymMemberInfo){
            return res.status(404).json({
                message: "Gym-Member profile not found.",
                success: false
            });
        }

        gymMemberInfo.height = height;
        gymMemberInfo.first_name = first_name;
        gymMemberInfo.last_name = last_name;
        gymMemberInfo.phone_number = phone_number;
        gymMemberInfo.weight = weight;

        await gymMemberInfo.save();

        res.status(200).json({message : "The Profile has been successfully Updated!", success : true });

    } catch (error) {
        console.error("Error during Updating the Gym-Member Profile:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
}



//Get All the Trainer that are registered
exports.GetAllTrainer = async (req,res) => {
    try {   
        //Fetch Users whose role is Trainer 
        const users = await User.find({role : 'Trainer'}, "first_name last_name email _id createdAt"); // Fetch only necessary fields
        res.json(users);
    } catch (error) {
        console.error("Error during resetPassword:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
}


//Get Particular Trainer Profile
exports.getTrainerProfile = async (req,res) => {
    try {
        const { _id, role } = req.user;
        
        //Verify the User is Trainer 
        if ( role !== "Trainer"){
            return res.status(403).json({ message : "Access Denied Only Trainer can access their Profile!", success : false });
        }

        const TrainerProfile = await User.findOne({ _id, role : "Trainer" })
        .select("first_name last_name email phone_number dob gender address height weight expertise experience certifications");

        if (!TrainerProfile){
            return res.status(404).json({
                message: "Trainer profile not found.",
                success: false
            });
        }
        
        res.status(200).json({ message : 'Trainer Profile Data fetched Successfully!', success : true, TrainerProfile });
    } catch (error) {
        console.error("Error during resetPassword:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
}


//Update Trainer Profile 
exports.UpdateTrainerProfile = async (req,res) => {
    try {
        const { _id, role } = req.user;
        const { height, weight, expertise, experience, certifications, first_name, last_name} = req.body;

        //Verify the User is Trainer
        if(role !== "Trainer"){
            return res.status(403).json({ message : "Access Denied Only Trainer can access their Profile!", success : false });
        }

        const TrainerInfo = await User.findOne({_id, role : "Trainer"});

        if (!TrainerInfo){
            return res.status(404).json({
                message: "Trainer profile not found.",
                success: false
            });
        }

        TrainerInfo.height = height;
        TrainerInfo.first_name = first_name;
        TrainerInfo.last_name = last_name;
        TrainerInfo.certifications = certifications;
        TrainerInfo.experience = experience;
        TrainerInfo.expertise = expertise;
        TrainerInfo.weight = weight;

        await TrainerInfo.save();

        res.status(200).json({message : "The Profile has been successfully Updated!", success : true });

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

        res.status(200).json({ message: "Trainer assigned successfully!",member });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error!', success : false
        });
    }
}



//View Assigned Trainer to all Members for Admin
exports.getAssignedTrainers = async (req, res) => {
    try {
        const { memberId } = req.params;
        const membersWithTrainers = await User.find({ role: "Member", _id : memberId,trainer_id: { $ne: null } }) 
            .populate("trainer_id", "first_name last_name email") // Fetch trainer details (name, email)
            .select("first_name last_name email trainer_id"); // Select relevant fields

        if (membersWithTrainers.length === 0) {
            return res.status(404).json({ error: "No members with assigned trainers found",success : false });
        }

        res.status(200).json(membersWithTrainers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error!', success : false
        });
    }
};



//View Assigned Trainer of a particular Member 
exports.getAssignedUserTrainer = async (req, res) => {
    try {
        const { memberId } = req.user._id;
        const membersWithTrainers = await User.findOne({ role: "Member", _id : memberId,trainer_id: { $ne: null } }) 
            .populate("trainer_id", "first_name last_name email expertise experience certifications") // Fetch trainer details (name, email)
            .select("first_name last_name email trainer_id"); // Select relevant fields

        if (membersWithTrainers.length === 0) {
            return res.status(404).json({ error: "No Trainers Assigned",success : false });
        }

        res.status(200).json(membersWithTrainers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error!', success : false
        });
    }
};




exports.assignWorkoutPlan = async (req,res) => {
    try {
     const  UserId  = req.params.userID;
     const { WorkoutPlanId }  = req.body;
   
     console.log(`Assigning Workout plan with id : ${WorkoutPlanId} to Gym-Member Id : ${UserId}`);
   
     // check if the workout plan exists 
     const workoutPlan = await WorkoutPlan.findById(WorkoutPlanId);
     if (!workoutPlan){
      return res.status(404).json({error: "The Workout Plan not found !", success : false});
     }
   
     // check if the User exists 
     const gymMember = await User.findById(UserId);
     if (!gymMember){
      return res.status(404).json({error: "The Gym-Member not found !", success : false});
     }
   
     //Assign the WorkoutPlan to the Gym-member
     gymMember.workoutPlanId = WorkoutPlanId;
     await gymMember.save();
   
     console.log(`WorkOut Plan assigned successfully to the Gym-Member ${gymMember.first_name} ${gymMember.last_name} !`);
   
     res.status(200).json({message : " The Workout Plan assigned Successfully! ", success : true , gymMember});
    } catch (error) {
     console.log(error);
     return res.status(500).json({
      error: 'Internal Server Error!', success : false
     });
    }
   }


exports.getAssignedMembers = async (req, res) => {
try {
    const { _id, role } = req.user;

    // Ensure the User is a trainer
    if (role !== "Trainer") {
        return res.status(403).json({ message: "Access Denied! Only trainers can see the assigned members.", success: false });
    }

    // Pagination parameters from query string (default values provided)
    const page = parseInt(req.query.page) || 1; // Current page (default: 1)
    const limit = parseInt(req.query.limit) || 10; // Number of items per page (default: 10)

    const skip = (page - 1) * limit;  // Calculate the number of documents to skip

    // Count the total number of assigned members (without pagination)
    const totalAssignedMembers = await User.countDocuments({ trainer_id: _id, role: "Member" });

    // Find assigned members with pagination
    const assignedMembers = await User.find({ trainer_id: _id, role: "Member" })
        .skip(skip)
        .limit(limit);

    if (!assignedMembers.length) {
        return res.status(404).json({ message: "No members are assigned to the Trainer!", success: false });
    }

    res.status(200).json({
        message: "The assigned members are fetched!",
        assignedMembers,
        total: totalAssignedMembers, // Send the total count for pagination
        page,          // Send the current page for client-side use
        limit,         // Send the limit for client-side use
        success: true
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({
        error: 'Internal Server Error!', success: false
    });
}
};