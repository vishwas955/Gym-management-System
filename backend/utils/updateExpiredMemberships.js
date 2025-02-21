<<<<<<< HEAD
const membership_model = require('../model/membership_model');

exports.updateExpiredMemberships = async () => {
    try {
      const today = new Date();
  
      // Find memberships where endDate is past but status is still "Active"
      const expiredMemberships = await membership_model.find({
        endDate: { $lt: today },
        status: "Active",
      });
  
      if (expiredMemberships.length > 0) {
        // Update all found memberships to "Expired"
        await Membership.updateMany(
          { _id: { $in: expiredMemberships.map((m) => m._id) } },
          { $set: { status: "Expired" } }
        );
        console.log(`${expiredMemberships.length} memberships marked as Expired.`);
      }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Error Upadting Expired Memberships', success : false
        });
    }
=======
const membership_model = require('../model/membership_model');

exports.updateExpiredMemberships = async () => {
    try {
      const today = new Date();
  
      // Find memberships where endDate is past but status is still "Active"
      const expiredMemberships = await membership_model.find({
        endDate: { $lt: today },
        status: "Active",
      });
  
      if (expiredMemberships.length > 0) {
        // Update all found memberships to "Expired"
        await Membership.updateMany(
          { _id: { $in: expiredMemberships.map((m) => m._id) } },
          { $set: { status: "Expired" } }
        );
        console.log(`${expiredMemberships.length} memberships marked as Expired.`);
      }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Error Upadting Expired Memberships', success : false
        });
    }
>>>>>>> be89ed79ae96f310cce4fdf4460d1d1022292e25
  };