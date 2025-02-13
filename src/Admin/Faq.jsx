import React, { useState } from "react";
import { motion } from "framer-motion";

const ManageFAQ = () => {
  // Dummy data for FAQ
  const [faqs, setFaqs] = useState([
    { id: 1, question: "What are the gym's working hours?", answer: "We are open from 6 AM to 10 PM daily." },
    { id: 2, question: "Do I need to bring my own equipment?", answer: "No, we provide all necessary gym equipment." },
    { id: 3, question: "Can I cancel my membership?", answer: "Yes, you can cancel your membership anytime with a 30-day notice." },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  // Handle adding a new FAQ
  const handleAddFAQ = () => {
    const newFAQ = {
      id: faqs.length + 1,
      question: newQuestion,
      answer: newAnswer,
    };
    setFaqs([...faqs, newFAQ]);
    setNewQuestion("");
    setNewAnswer("");
  };

  // Handle updating an existing FAQ
  const handleUpdateFAQ = () => {
    const updatedFAQs = faqs.map((faq) =>
      faq.id === editingFAQ.id
        ? { ...faq, question: newQuestion, answer: newAnswer }
        : faq
    );
    setFaqs(updatedFAQs);
    setEditingFAQ(null);
    setNewQuestion("");
    setNewAnswer("");
  };

  // Handle deleting an FAQ
  const handleDeleteFAQ = () => {
    setFaqs(faqs.filter((faq) => faq.id !== faqToDelete.id));
    setDeleteConfirm(false);
    setFaqToDelete(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage FAQ</h1>

      {/* Add or Edit FAQ Form */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <motion.ul
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {faqs.map((faq) => (
            <motion.li
              key={faq.id}
              className="border-b py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
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
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to delete this FAQ?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleDeleteFAQ}
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

export default ManageFAQ;
