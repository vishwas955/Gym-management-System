import React from 'react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Reports Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/MembershipReport')}
          className="bg-blue-500 text-white py-6 px-6 rounded-lg shadow-lg hover:bg-blue-600"
        >
          Membership Report
        </button>
        <button
          onClick={() => navigate('/MemberReport')}
          className="bg-blue-500 text-white py-6 px-6 rounded-lg shadow-lg hover:bg-blue-600"
        >
          Member Report
        </button>
        <button
          onClick={() => navigate('/Trainerreport')}
          className="bg-blue-500 text-white py-8 px-6 rounded-lg shadow-lg hover:bg-blue-600"
        >
          Trainer Report
        </button>
        <button
          onClick={() => navigate('/ManagePayments')}
          className="bg-blue-500 text-white py-8 px-6 rounded-lg shadow-lg hover:bg-blue-600"
        >
          Payment Report
        </button>
      </div>
    </div>
  );
};

export default Reports;
