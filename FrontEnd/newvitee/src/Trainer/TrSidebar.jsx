import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

const TrSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("/Trainer/TrainerDashboard");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  return (
    <div className="flex">
      {/* Sidebar Toggle Buttons */}
      <button
        className={`fixed top-4 left-4 z-10 bg-gradient-to-r from-violet-500 to-purple-700 text-white p-2 rounded-lg hover:from-violet-600 hover:to-purple-800 transition-colors ${
          isOpen ? "hidden" : "block"
        }`}
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <button
        className={`fixed top-4 left-4 z-10 bg-gradient-to-r from-violet-500 to-purple-700 text-white p-2 rounded-lg hover:from-violet-600 hover:to-purple-800 transition-colors ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-gradient-to-r from-violet-500 to-purple-700 text-white p-6 shadow-2xl transition-width duration-500 sticky top-0 h-screen ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <h2 className="text-3xl font-extrabold mt-8 mb-10">Hello Trainer</h2>
        <ul className="space-y-6">
          <li>
            <Link
              to="/Trainer/TrainerDashboard"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Trainer/TrainerDashboard"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Trainer/TrainerDashboard")}
            >
              <HomeIcon className="h-6 w-6 mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/Trainer/assignedmembers"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Trainer/assignedmembers"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Trainer/assignedmembers")}
            >
              <UserGroupIcon className="h-6 w-6 mr-2" />
              Assigned Members
            </Link>
          </li>
          <li>
            <Link
              to="/Trainer/TrWkPlan"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Trainer/TrWkPlan"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Trainer/TrWkPlan")}
            >
              <DocumentTextIcon className="h-6 w-6 mr-2" />
              Workout Plans
            </Link>
          </li>
          <li>
            <Link
              to="/Trainer/Feedback"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Trainer/Feedback"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Trainer/Feedback")}
            >
              <EnvelopeIcon className="h-6 w-6 mr-2" />
              Feedback
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default TrSidebar;