import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const UserHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-button") &&
        !event.target.closest(".dropdown-menu")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = async (confirm) => {
    if (confirm) {
      try {
        await axios.post("http://localhost:4000/auth/User/logout", {}, {
          withCredentials: true,
        });
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
    setShowConfirm(false);
  };

  return (
    <>
      <header className="bg-indigo-900 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Gym Member Dashboard</h1>

        <div className="relative">
          <button
            className="dropdown-button bg-indigo-700 hover:bg-indigo-800 text-white rounded-full p-2"
            onClick={toggleDropdown}
          >
            <UserIcon className="h-6 w-6" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                className="dropdown-menu absolute right-0 top-12 bg-indigo-700 text-white p-4 rounded-md shadow-md w-40"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <li className="py-2 hover:bg-indigo-800 cursor-pointer">
                  <Link to="/User/Profile">Profile</Link>
                </li>
                <hr className="my-2 border-indigo-600" />
                <li
                  className="py-2 hover:bg-indigo-800 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </header>

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

export default UserHeader;