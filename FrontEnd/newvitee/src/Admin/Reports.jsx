import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();
  const [clickedButton, setClickedButton] = useState(null);

  const reportCards = [
    { 
      title: "Membership Report", 
      path: "/MembershipReport", 
      color: "bg-gradient-to-r from-purple-500 to-violet-600",
      // icon: "📊"
    },
    { 
      title: "Member Report", 
      path: "/MemberReport", 
      color: "bg-gradient-to-r from-violet-500 to-purple-700",
      // icon: "👥"
    },
    { 
      title: "Trainer Report", 
      path: "/Trainerreport", 
      color: "bg-gradient-to-r from-fuchsia-500 to-purple-600",
      // icon: "💪"
    },
    { 
      title: "Payment Report", 
      path: "/ManagePayments", 
      color: "bg-gradient-to-r from-purple-600 to-indigo-700",
      // icon: "💰"
    },
  
  ];

  const handleClick = (index, path) => {
    setClickedButton(index);
    setTimeout(() => {
      navigate(path);
      setClickedButton(null);
    }, 300);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Reports Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {reportCards.map((card, index) => (
          <div 
            key={index}
            onClick={() => handleClick(index, card.path)}
            className={`${card.color} text-white rounded-xl shadow-xl transform transition-all duration-300 
              ${clickedButton === index ? 'scale-90 rotate-1' : 'hover:scale-105 hover:-rotate-1'} 
              cursor-pointer overflow-hidden group relative`}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-start">
                <span className="text-3xl mr-4">{card.icon}</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                  <p className="opacity-80 text-purple-100">View detailed {card.title.toLowerCase()}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center transform group-hover:translate-x-2 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className={`absolute inset-0 bg-white bg-opacity-10 transition-opacity ${clickedButton === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-20'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;