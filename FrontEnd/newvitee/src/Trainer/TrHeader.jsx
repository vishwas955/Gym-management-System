import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const Header = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = (confirm) => {
    if (confirm) {
      navigate("/login");
    }
    setShowConfirm(false);
  };

  return (
    <>
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-lg relative z-10">
        <h1 className="text-xl font-bold">Trainer Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </header>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to log out?
            </h3>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => confirmLogout(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => confirmLogout(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
