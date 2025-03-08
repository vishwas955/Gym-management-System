const User = require("../model/User_model");
const jwt = require("jsonwebtoken");


exports.auth = async (req,res,next) => {
    try {
        const token = req.cookies.cookie_token;
        
        if (!token){ // checks if the User has logged in and token is generated
            return res.status(400).json({error:"No Token is generated, Authorisation Denied!"});
        }

        const decode = jwt.verify(token,process.env.JWT_SecretKey);    

        req.user = await User.findById(decode.User_id).select('-password'); 

        next();

    } catch (error) {
        res.status(401).json({error:"Token not valid!"});
    }
}
 
exports.IsAdminAuth = async (req,res,next) => {
    try {
        const token = req.cookies.cookie_token;
        
        if (!token){ // checks if the Admin has logged in and token is generated
            return res.status(400).json({error:"No Token is generated, Authorisation Denied!"});
        }

        const decode = jwt.verify(token,process.env.JWT_SecretKey);    

        req.user = await User.findById(decode.User_id).select('-password'); 

        if (decode.role !== "Admin") {
            return res.status(403).json({ error: "Forbidden: Admins only!" });
        }

        next();

    } catch (error) {
        res.status(401).json({error:"Token not valid!"});
    }
}


exports.IsTrainerAuth = async (req,res,next) => {
    try {
        const token = req.cookies.cookie_token;
        
        if (!token){ // checks if the Admin has logged in and token is generated
            return res.status(400).json({error:"No Token is generated, Authorisation Denied!"});
        }

        const decode = jwt.verify(token,process.env.JWT_SecretKey);    

        req.user = await User.findById(decode.User_id).select('-password'); 

        if (decode.role !== "Trainer") {
            return res.status(403).json({ error: "Forbidden: Trainers only!" });
        }

        next();

    } catch (error) {
        res.status(401).json({error:"Token not valid!"});
    }
}