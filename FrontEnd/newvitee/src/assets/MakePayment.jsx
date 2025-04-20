import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FPayment = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch plan details
  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/subscription/get-subscription/${planId}`,
          { withCredentials: true }
        );
        if (response.data) {
          setSelectedPlan(response.data);
        }
      } catch (error) {
        console.error('Error fetching plan details:', error);
      }
    };
    fetchPlanDetails();
  }, [planId]);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!cardNumber.match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Card number must be 16 digits.';
    }
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
    } else {
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Expiry date cannot be in the past.';
      }
    }
    if (!cvv.match(/^\d{3}$/)) {
      newErrors.cvv = 'CVV must be 3 digits.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle payment submission
  const handlePayment = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      alert('Please fix the errors in the form.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Step 1: Make Payment Request
      const paymentResponse = await axios.post(
        'http://localhost:4000/payment/add-payment',
        {
          transaction_id: `TXN-${Date.now()}`,
          plan_id: selectedPlan._id,
          amount: selectedPlan.price,
           method: "Card",  // Added method
          status: "Completed"
        },
        { withCredentials: true }
      );

      if (paymentResponse.data.success) {
        // Step 2: Update Membership After Payment
        const startDate = new Date().toISOString(); // Get current date in ISO format

        await axios.post(
          'http://localhost:4000/membership/update-user-membership',
          { subscriptionId: selectedPlan._id, startDate },  // Sending plan ID & start date
          { withCredentials: true }
        );

        alert(`Payment for ${selectedPlan.name} completed successfully! Your membership has been updated.`);

        await axios.post("http://localhost:4000/auth/User/logout", {}, {
          withCredentials: true,
        });
        
        navigate('/login'); // Redirect to dashboard or membership page
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Payment processing failed');
    } finally {
      setIsLoading(false);
      // Clear sensitive fields
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Payment for {selectedPlan?.name || 'Plan'}
      </h2>

      {selectedPlan ? (
        <form onSubmit={handlePayment}>
          <div className="space-y-4">
            {/* Card Number Field */}
            <div>
              <label className="block text-gray-700 font-medium">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                className={`w-full px-4 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                maxLength="16"
              />
              {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
            </div>

            {/* Expiry Date Field */}
            <div>
              <label className="block text-gray-700 font-medium">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, '') // Remove non-digits
                    .replace(/(\d{2})(\d{0,2})/, '$1/$2') // Add slash after MM
                    .substring(0, 5); // Limit to MM/YY format
                  setExpiryDate(value);
                }}
                className={`w-full px-4 py-2 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
            </div>

            {/* CVV Field */}
            <div>
              <label className="block text-gray-700 font-medium">CVV</label>
              <input
                type="password"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                className={`w-full px-4 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                maxLength="3"
              />
              {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : `Pay Rs.${selectedPlan.price}`}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-gray-500">Loading plan details...</p>
      )}
    </div>
  );
};

export default FPayment;
