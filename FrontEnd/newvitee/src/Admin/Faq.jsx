import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ManageFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const BASE_API_URL = 'http://localhost:4000/FAQ'

  // Fetch FAQs from backend
  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/get-faq`, { withCredentials : true })
      .then((res) => setFaqs(res.data))
      .catch((err) => console.error("Error fetching FAQs:", err));
  }, []);

  // Handle adding a new FAQ
  const handleAddFAQ = async () => {
    try {
      const res = await axios.post(`${BASE_API_URL}/add-faq`, { question: newQuestion, answer: newAnswer }, 
        {withCredentials : true }
      );
      setFaqs([...faqs, res.data.faq]);
      setNewQuestion("");
      setNewAnswer("");
    } catch (err) {
      console.error("Error adding FAQ:", err);
    }
  };

  // Handle updating an existing FAQ
  const handleUpdateFAQ = async () => {
    try {
      const res = await axios.put(`${BASE_API_URL}/update-faq/${editingFAQ._id}`, { question: newQuestion, answer: newAnswer },
        {withCredentials : true}
      );
      setFaqs(faqs.map((faq) => (faq._id === editingFAQ._id ? res.data.faq : faq)));
      setEditingFAQ(null);
      setNewQuestion("");
      setNewAnswer("");
    } catch (err) {
      console.error("Error updating FAQ:", err);
    }
  };

  // Handle deleting an FAQ
  const handleDeleteFAQ = async () => {
    try {
      await axios.delete(`${BASE_API_URL}/delete-faq/${faqToDelete._id}`, 
        {withCredentials : true }
      );
      setFaqs(faqs.filter((faq) => faq._id !== faqToDelete._id));
      setDeleteConfirm(false);
      setFaqToDelete(null);
    } catch (err) {
      console.error("Error deleting FAQ:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">FAQ</h1>

      {/* Add or Edit FAQ Form */}
      <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Question</label>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter FAQ question"
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Answer</label>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Enter FAQ answer"
            className="p-2 border border-gray-300 rounded w-full"
            rows="4"
          ></textarea>
        </div>
        <motion.button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={editingFAQ ? handleUpdateFAQ : handleAddFAQ}
          disabled={!newQuestion || !newAnswer}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {editingFAQ ? "Update FAQ" : "Add FAQ"}
        </motion.button>
      </motion.div>

      {/* FAQ List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <motion.ul className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {faqs.map((faq) => (
            <motion.li key={faq._id} className="border-b py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-semibold">{faq.question}</p>
                  <p className="text-gray-600 mt-1">{faq.answer}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingFAQ(faq);
                      setNewQuestion(faq.question);
                      setNewAnswer(faq.answer);
                    }}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirm(true);
                      setFaqToDelete(faq);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <motion.div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <motion.div className="bg-white p-6 rounded-lg shadow-lg w-1/3" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this FAQ?</h2>
            <div className="flex justify-between">
              <button onClick={handleDeleteFAQ} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirm(false)} className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ManageFAQ;
