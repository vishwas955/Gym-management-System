import React, { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout with confirmation
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    try {
      const response = await axios.post("http://localhost:4000/auth/User/logout", {}, { withCredentials: true });
      
      if (response.status === 200) {
        console.log("Logged out successfully");
        navigate("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-700 to-violet-500 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center pl-12">
        <h1 className="text-2xl font-bold">Caliber Fitness</h1>
      </div>
      <div className="relative">
        <button
          className="dropdown-button bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2"
          onClick={toggleDropdown}
        >
          <UserIcon className="h-6 w-6" />
        </button>
        {isOpen && (
          <ul className="dropdown-menu absolute right-0 top-12 bg-purple-600 text-white p-4 rounded-md shadow-md">
            <li
              className="py-2 px-4 hover:bg-purple-700 cursor-pointer rounded"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;