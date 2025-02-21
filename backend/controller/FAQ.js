const QnA = require("../model/chatbot_model");



// Get all FAQs
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await QnA.find(); // Fetch all FAQs
        res.status(200).json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};

// Create a new FAQ
exports.createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: "Question and Answer are required." });
        }

        const newFAQ = new QnA({ question, answer });
        await newFAQ.save();

        res.status(201).json({ message: "FAQ created successfully!", faq: newFAQ });
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update an existing FAQ
exports.updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;

        const updatedFAQ = await QnA.findByIdAndUpdate(id, { question, answer }, { new: true });
        if (!updatedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        res.status(200).json({ message: "FAQ updated successfully!", faq: updatedFAQ });
    } catch (error) {
        console.error("Error updating FAQ:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete an FAQ
exports.deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFAQ = await QnA.findByIdAndDelete(id);
        if (!deletedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        res.status(200).json({ message: "FAQ deleted successfully!" });
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
