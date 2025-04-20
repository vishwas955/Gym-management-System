import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
const BASE_API_URL = 'http://localhost:4000/feedback'

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  // Fetch feedbacks from backend
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/get-feedback`,
        {withCredentials : true }
      );
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  // Handle deleting feedback
  const handleDeleteFeedback = async () => {
    try {
      await axios.delete(`${BASE_API_URL}/delete-feedback/${feedbackToDelete._id}`,
        {withCredentials : true }
      );
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== feedbackToDelete._id));
      setDeleteConfirm(false);
      setFeedbackToDelete(null);
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  // Filter feedback based on search query
  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.feedbackText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Feedback</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by user name, email, or feedback"
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
            <th className="py-3 px-6 border-b">Email</th>
            <th className="py-3 px-6 border-b">Feedback</th>
            <th className="py-3 px-6 border-b">Date</th>
            <th className="py-3 px-6 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedbacks.map((feedback) => (
            <motion.tr
              key={feedback._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <td className="py-4 px-6 border-b text-center">
                {feedback.userID?.first_name} {feedback.userID?.last_name}
                </td>
              <td className="py-4 px-6 border-b text-center">{feedback.userID?.email}</td>
              <td className="py-4 px-6 border-b text-center">{feedback.feedbackText}</td>
              <td className="py-4 px-6 border-b text-center">{new Date(feedback.createdAt).toLocaleDateString()}</td>
              <td className="py-4 px-6 border-b text-center">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    setDeleteConfirm(true);
                    setFeedbackToDelete(feedback);
                  }}
                >
                  Disable
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-1/3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this feedback?</h2>
            <div className="flex justify-between">
              <button
                onClick={handleDeleteFeedback}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Feedback;
