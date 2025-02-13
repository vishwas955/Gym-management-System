import React, { useState } from "react";
import { motion } from "framer-motion";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, user: "John Doe", message: "Great service!", date: "2025-01-25" },
    { id: 2, user: "Jane Smith", message: "Very helpful staff!", date: "2025-01-26" },
    { id: 3, user: "Michael Lee", message: "Amazing workout plans.", date: "2025-01-27" },
    { id: 4, user: "Sara Green", message: "Love the gym environment.", date: "2025-01-28" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  // Filter feedback based on search query
  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle deleting feedback
  const handleDeleteFeedback = () => {
    setFeedbacks(feedbacks.filter((feedback) => feedback.id !== feedbackToDelete.id));
    setDeleteConfirm(false);
    setFeedbackToDelete(null);
  };

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
            <th className="py-3 px-6 border-b">Actions</th>
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
              <td className="py-4 px-6 border-b text-center">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    setDeleteConfirm(true);
                    setFeedbackToDelete(feedback);
                  }}
                >
                  Delete
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
