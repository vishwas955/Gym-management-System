import React, { useState } from 'react';
import axios from 'axios';

const UserFeedback = () => {
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!comments.trim()) {
      newErrors.comments = 'Please provide your comments.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Sending only 'feedbackText' as expected by the backend
      const feedback = { feedbackText: comments };

      await axios.post(
        'http://localhost:4000/feedback/add-feedback',
        feedback,
        { withCredentials: true }
      );

      setFeedbackSubmitted(true);
      setComments(''); // Clear comment box
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Gym Feedback
      </h2>

      {feedbackSubmitted && (
        <div className="mb-6 p-4 bg-green-100 border border-green-500 rounded-md text-center text-green-800">
          <p>Thank you for your feedback!</p>
        </div>
      )}

      {loading ? (
        <p>Submitting feedback...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Comments Input */}
          <div>
            <label className="block text-gray-700 font-medium">
              Your Comments
            </label>
            <textarea
              placeholder="Please share your feedback"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows="4"
              className={`w-full px-4 py-2 border ${
                errors.comments ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            ></textarea>
            {errors.comments && (
              <p className="text-red-500 text-sm">{errors.comments}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserFeedback;
