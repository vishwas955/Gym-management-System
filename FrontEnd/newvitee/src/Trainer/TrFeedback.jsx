import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const TrFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/trainer/get-trainer-feedback",
                    { withCredentials: true }
                );

                console.log("API Response:", response.data); // Debugging
                if (Array.isArray(response.data)) {
                    setFeedbacks(response.data);
                } else {
                    setFeedbacks([]); // Ensures no error if API returns unexpected format
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (loading) return <p>Loading feedback...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Trainer Feedback</h1>

            {/* Feedback Table */}
            <motion.table
                className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <thead>
                    <tr>
                        <th className="py-3 px-6 border-b">Feedback</th>
                        <th className="py-3 px-6 border-b">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.length > 0 ? (
                        feedbacks.map((feedback) => (
                            <motion.tr
                                key={feedback._id || feedback.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="py-4 px-6 border-b text-center">
                                    {feedback.feedbackText || "No feedback provided"}
                                </td>
                                <td className="py-4 px-6 border-b text-center">
                                    {feedback.createdAt
                                        ? new Date(feedback.createdAt).toLocaleDateString()
                                        : "N/A"}
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="py-4 px-6 text-center">
                                No feedback available
                            </td>
                        </tr>
                    )}
                </tbody>
            </motion.table>
        </div>
    );
};

export default TrFeedback;
