const Feedback = require("../model/feedback_model");
const User = require("../model/User_model");

// Get all Feedbacks with User Details
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('userID', 'first_name last_name email') // Fetch associated user details
            .select('feedbackText userID createdAt'); // Select relevant fields

        res.status(200).json({message : "All the feedbacks fetched successfully!", success : true, feedbacks});
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// Create a new Feedback
exports.createFeedback = async (req, res) => {
    try {
        const { _id, role } = req.user;
        const { feedbackText } = req.body;

        if (!_id || !feedbackText) {
            return res.status(400).json({ message: "User ID and Feedback Text are required." });
        }

        if ( role !== "Member"){
            return res.status(403).json({ message : "Access Denied Only Gym-Member can give Feedback!", success : false });
        }

        // Check if the user exists
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "Gym-Member not found." });
        }

        const newFeedback = new Feedback({ userID : _id, feedbackText });
        await newFeedback.save();

        res.status(201).json({ message: "Feedback created successfully!", success : true, feedback: newFeedback.feedbackText });
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a Feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFeedback = await Feedback.findByIdAndDelete(id);
        if (!deletedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback deleted successfully!" });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



exports.getTrainerFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .select('feedbackText createdAt'); // Select relevant fields

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
