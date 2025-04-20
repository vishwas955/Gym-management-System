import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const UserMembership = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current membership details
        const response = await axios.get("http://localhost:4000/membership/get-user-membership", {
          withCredentials: true, // Send cookies for authentication
        });

        if (!response.data || !response.data.membership) {
          throw new Error("No membership found.");
        }

        // Extracting current plan details from the response
        const membershipData = response.data.membership;
        setCurrentPlan(membershipData.subscriptionId); // Assuming subscriptionId contains plan details
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Failed to fetch membership details.");
      } finally {
        setLoading(false); // Set loading to false after the request is completed
      }
    };

    fetchData();
  }, []);

  const handleUpdatePlan = () => {
    navigate('/User/UserSubscritpion'); // Redirect to subscription selection page
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Membership</h2>

      {/* Current Plan Section */}
      <div className="bg-gray-100 p-5 rounded-lg shadow-md">
        <h3 className="text-xl font-medium text-gray-700">Current Active Plan</h3>
        {loading ? (
          <p className="mt-4 text-gray-500">Loading...</p>
        ) : error ? (
          <p className="mt-4 text-red-500">{error}</p>
        ) : currentPlan ? (
          <div className="mt-4">
            <p className="text-lg font-semibold text-gray-600">Plan: {currentPlan.name}</p>
            <p className="text-lg text-gray-500">Price: Rs.{currentPlan.price}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleUpdatePlan}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Update Plan
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No active plan found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default UserMembership;
