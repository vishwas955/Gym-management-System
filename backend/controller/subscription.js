const subscription_model = require('../model/subscription_model');

exports.addsubscription = async (req,res) => {
    try {
        const {name, duration, details, price} = req.body;
        const subsname = await subscription_model.findOne({name});
        const subsplan = await subscription_model.findOne({duration,price});

        if(subsname && subsplan){
            return res.status(400).json({
                error:'Subscription Plan already exists!'
            })
        }else{
            const newsubscription = new subscription_model({name, duration, details, price});
            await newsubscription.save();
            res.status(200).json({
                message:'Plan Added Successfully'
            })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal Server Error!'
        });
    }
}


exports.UpdateSubscription = async (req,res) => {
    try {
        const  id  = req.params.id;
        const {name, duration, details, price } = req.body;
        const subscription = await subscription_model.findById(id);

        if (subscription){
            subscription.price = price;
            subscription.duration = duration;
            subscription.details = details;
            subscription.name = name;

            await subscription.save();
            
            res.status(200).json({
                message:'Subscription Plan Updated Successfully!'
            })

        }else{
            return res.status(400).json({
                error:'Subscription Plan Does not exists!'
            })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error:'Server Error!'
        })
    }
}

exports.deleteSubscription = async (req, res) => {
    try {
        const  id  = req.params.id;
        const subscription = await subscription_model.findByIdAndDelete(id);
    
        if (!subscription) {
            return res.status(404).json({
                error: 'Subscription plan not found!'
            });
        }

        res.status(200).json({
            message: 'Subscription Plan deleted successfully'
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Server Error!'
        });
    }
};

exports.getSubscription = async (req,res) => {
    try {
        const SubsPlans = await subscription_model.find();
        res.status(200).json(
            SubsPlans
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Server Error!'
        });
    } 
}


exports.getSubscriptionById = async (req,res) => {
    try {
        const  id  = req.params.id;
        const SubsPlans = await subscription_model.findById(id);
        res.status(200).json(
            SubsPlans
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Server Error!'
        });
    } 
}