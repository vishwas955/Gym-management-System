import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API requests
import { motion } from 'framer-motion';

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Fetch available plans from the backend API
        const response = await axios.get('http://localhost:4000/subscription/get-subscription', { withCredentials: true });
        setPlans(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after the request is completed
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (planId) => {
    // Redirect to the payment page with the selected plan
    navigate(`/Payment/${planId}`);
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Select a Subscription Plan</h2>

      {loading ? (
        <p className="text-gray-500 text-lg text-center">Loading plans...</p>
      ) : error ? (
        <p className="text-red-500 text-lg text-center">{error}</p>
      ) : plans.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">No plans available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            let bgColor = 'bg-indigo-600'; // Default background color
            if (plan.duration === 6) bgColor = 'bg-blue-600'; // Example for a specific duration
            if (plan.duration === 12) bgColor = 'bg-green-600'; // Example for another duration

            return (
              <motion.div
                key={plan._id} // Use _id from MongoDB as key
                className="rounded-lg shadow-md hover:shadow-xl transition duration-300 flex flex-col"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Top Section */}
                <div className={`p-6 ${bgColor} text-white rounded-t-lg`}>
                  <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
                  <p className="text-center text-sm mt-2">Billed every {plan.duration} month(s)</p>
                  <div className="flex justify-center items-center mt-4">
                    <span className="text-4xl font-bold">Rs.{plan.price}</span>
                    <span className="text-lg ml-1">/year</span>
                  </div>
                </div>

                {/* Middle Section (Features) */}
                <ul className="list-none p-6 flex-grow">
                  {/* Displaying details of the plan */}
                  <li className="text-lg text-gray-700 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {plan.details || "No details available."}
                  </li>
                </ul>

                {/* Bottom Section (Button) */}
                <div className="p-6">
                  <button
                    onClick={() => handleSelectPlan(plan._id)} // Pass the plan ID to the handler
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Choose Plan
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Subscription;
