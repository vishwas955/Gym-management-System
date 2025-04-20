import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserSubscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:4000/subscription/get-subscription', { withCredentials: true });
        setPlans(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (planId) => {
    navigate(`/User/UserPayment/${planId}`);
  };

  // Array of gradient colors for the cards
  const cardGradients = [
    'bg-gradient-to-br from-purple-400 via-violet-500 to-fuchsia-500',
    'bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-600',
    'bg-gradient-to-br from-fuchsia-400 via-purple-500 to-violet-600',
    'bg-gradient-to-br from-lavender-300 via-purple-400 to-violet-500'
  ];

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
          {plans.map((plan, index) => {
            // Cycle through the gradient colors based on index
            const gradientClass = cardGradients[index % cardGradients.length];
            
            return (
              <motion.div
                key={plan._id}
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col h-full"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Top Section with Gradient */}
                <div className={`p-6 ${gradientClass} text-white`}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {plan.duration} {plan.duration === 1 ? 'Month' : 'Months'}
                    </span>
                  </div>
                  <div className="mt-6 flex items-end">
                    <span className="text-4xl font-bold">Rs.{plan.price}</span>
                    <span className="text-lg ml-1 mb-1">/year</span>
                  </div>
                </div>

                {/* Middle Section (Features) */}
                <div className="p-6 flex-grow bg-white">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{plan.details || "Premium access"}</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">All equipment included</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">24/7 gym access</span>
                    </li>
                  </ul>
                </div>

                {/* Bottom Section (Button) */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => handleSelectPlan(plan._id)}
                    className={`w-full px-6 py-3 ${gradientClass} text-white rounded-lg hover:opacity-90 transition duration-300 shadow-md`}
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

export default UserSubscription;