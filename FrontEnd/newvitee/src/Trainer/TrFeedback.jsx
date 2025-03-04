import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from 'axios';

const TrFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get("http://localhost:4000/feedback/get-feedback", {
                    withCredentials: true
                });

                setFeedbacks(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    // Filter feedback based on search query
    const filteredFeedbacks = feedbacks.filter(
        (feedback) =>
            feedback.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feedback.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <p>Loading feedback...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Feedback</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by user name or feedback"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            {/* Feedback Table */}
            <motion.table
                className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <thead>
                    <tr>
                        <th className="py-3 px-6 border-b">User</th>
                        <th className="py-3 px-6 border-b">Feedback</th>
                        <th className="py-3 px-6 border-b">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFeedbacks.map((feedback) => (
                        <motion.tr
                            key={feedback.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <td className="py-4 px-6 border-b text-center">{feedback.user}</td>
                            <td className="py-4 px-6 border-b text-center">{feedback.message}</td>
                            <td className="py-4 px-6 border-b text-center">{new Date(feedback.date).toLocaleDateString()}</td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>
        </div>
    );
};

export default TrFeedback;
