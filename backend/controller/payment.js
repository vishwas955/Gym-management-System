const Payment = require("../model/payment_model");

// Create a new payment record
exports.createPayment = async (req, res) => {
    try {
        const { transaction_id, gym_member_id, amount, method, status } = req.body;
        if (!transaction_id || !gym_member_id || !amount || !method || !status) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newPayment = new Payment({
            transaction_id,
            gym_member_id,
            amount,
            method,
            status
        });

        await newPayment.save();
        res.status(201).json({ message: "Payment created successfully!", payment: newPayment });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Fetch all payments (Admin access)
exports.getPayments = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        // Convert page and limit to integers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        // Create a search filter
        const searchRegex = new RegExp(search, "i");
        const filter = {
            $or: [
                { method: searchRegex },
                { status: searchRegex }
            ]
        };

        // Get total count of documents matching the filter
        const totalPayments = await Payment.countDocuments(filter);

        // Fetch the payments with pagination and filtering
        const payments = await Payment.find(filter)
            .populate("gym_member_id", "first_name last_name email") // Populate user name and email
            .sort({ payment_date: -1 }) // Sort by payment date (newest first)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            payments,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPayments / limitNumber),
            totalPayments
        });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Fetch payments by user ID (Gym member access)
exports.getPaymentsByUserId = async (req, res) => {
    try {
        const { _id } = req.user;
        const payments = await Payment.find({ gym_member_id: _id });
        if (!payments.length) {
            return res.status(404).json({ message: "No payments found for this user." });
        }
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error fetching payments by user ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update payment status (Admin access)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["Pending", "Completed", "Failed", "Refunded"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found." });
        }

        res.status(200).json({ message: "Payment status updated successfully.", payment: updatedPayment });
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a payment record (Admin access)
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPayment = await Payment.findByIdAndDelete(id);

        if (!deletedPayment) {
            return res.status(404).json({ message: "Payment not found." });
        }

        res.status(200).json({ message: "Payment deleted successfully." });
    } catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
