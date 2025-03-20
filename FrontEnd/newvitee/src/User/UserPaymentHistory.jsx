import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch payment history from the backend
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get('http://localhost:4000/payment/get-user-payment', {withCredentials: true}); // Replace with your backend endpoint
        setPaymentHistory(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching payment history:', err);
        setError('Failed to load payment history.');
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Payment History</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Payment History</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (paymentHistory.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Payment History</h2>
        <p className="text-gray-500">No payment history found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Payment History</h2>

      {/* Payment History List */}
      <div className="space-y-4">
        {paymentHistory.map((payment, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition duration-300">
            <h3 className="text-lg font-semibold">{payment.planName}</h3>
            <p className="text-sm text-gray-600">Amount: {payment.amount}</p>
            <p className="text-sm text-gray-600">Date: {payment.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPaymentHistory;