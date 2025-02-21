const membership_model = require('../model/membership_model');
const subscription_model = require('../model/subscription_model');
const expiredMemberships = require('../utils/updateExpiredMemberships');
const User_model = require('../model/User_model');


//Creating New Membership of the Gym Member 
exports.newMembership = async (req,res) => {
    try {
        const {gymMemberId, subscriptionId, startDate} = req.body;
        const membership = await membership_model.findOne({gymMemberId});
        if(membership){
            return res.status(400).json({
                error : 'Membership for this Gym-member already exists!'
            });
        }else{
            const subscription = await subscription_model.findById(subscriptionId);
            if (!subscription) {
                return res.status(404).json({ error: "Subscription plan not found!" });
            }

            const gymMember = await User_model.findById(gymMemberId);
            if (!gymMember) {
                return res.status(403).json({ error: "Only Gym-Members can have a Membership!" });
            }

            const durationInMonths = subscription.duration; // Extract the duration

            const start = new Date(startDate);
            start.setMonth(start.getMonth() + durationInMonths); // Add months to start date

            const endDate = start;
            const newMembership = new membership_model({gymMemberId, subscriptionId, startDate, endDate, status: 'Active'});
            await newMembership.save();
            
            res.status(200).json({
                message : 'The Membersip fo the New User Created Successfully1!',
                success : true
            })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal Server Error!', success : false
        }); 
    }
}


//Upadte the Membership of the gym members
exports.updateMembership = async (req, res) => {
    try{
       await expiredMemberships.updateExpiredMemberships();
       const gymMemberId = req.params.id ;
       const { subscriptionId, startDate} = req.body;
       const membership = await membership_model.findOne({gymMemberId}).populate('gymMemberId','first_name last_name');
       if (!membership){
        return res.status(404).json({
            error : 'Gym Member not found', success : false
        })
       }

       const subscription = await subscription_model.findById(subscriptionId);
       if (!subscription) {
            return res.status(404).json({ error: "Subscription plan not found!" });
        }
        
       const durationInMonths = subscription.duration; // Extract the duration

       const start = new Date(startDate);
       start.setMonth(start.getMonth() + durationInMonths); // Add months to start date
        const endDate = start;
       membership.subscriptionId = subscriptionId;
       membership.startDate = startDate;
       membership.endDate = endDate;
       membership.status = 'Active';

       await membership.save();

       res.status(200).json({
        message : `The Membership of the Gym Member ${membership.gymMemberId.first_name} ${membership.gymMemberId.last_name} is successfully updated`,
        success : true
       });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error!', success : false
        });
    }
}


//  Delete\Disable the Membership of the Gym MemberShip 
exports.disableMembership = async (req,res) => {
    try {
        await expiredMemberships.updateExpiredMemberships();
        const _id = req.params.id ;
        
        const membership = await membership_model.findById({_id}).populate("gymMemberId","first_name last_name");

        if (!membership){
            return res.status(404).json({
                error : 'Gym Member not found', success : false
            })
        }

        membership.status = 'Cancelled';

        await membership.save();

        res.status(200).json({
            message : `The Membership of the Gym Member ${membership.gymMemberId.first_name} ${membership.gymMemberId.last_name} is successfully Disabled`,
            success : true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error!', success : false
        });
    }
}


// Get all the Gym Member with their Membership
exports.getMembership = async (req,res) => {
    try {
        const {skip, limit} = req.query;
        const MemberShip = await membership_model.find({status:'Active'});
        const totalMemberships = MemberShip.length;

        const limitedMemberships = await membership_model
        .find({status : 'Active'}) // Fetch only active Membership 
        .populate("gymMemberId", "first_name last_name") //Populate User Detail
        .sort({createdAt : -1}) //Sort by newest first 
        .skip(skip) //Implement Pagination
        .limit(limit);

        res.status(200).json({
            message:MemberShip.length?" All the Active Memberships Fetched Successfully":"There is no Active Membership!",// checks if there is any Membership Active
            memberships : limitedMemberships, //Shows the limited Memberships in the limit 
            totalMemberships : totalMemberships, //shows Total number of Active Memberships
            success : true
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Internal Server Error!', success : false
        });
    }
}