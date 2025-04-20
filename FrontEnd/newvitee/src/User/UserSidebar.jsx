import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ClipboardIcon,
  UsersIcon,
  CreditCardIcon,
  UserPlusIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

const UserSidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("/User/UserDashboard");
  
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
        className={`fixed top-4 left-4 z-50 bg-indigo-900 text-white p-2 rounded-lg hover:bg-indigo-800 transition-colors ${
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
        className={`fixed top-4 left-4 z-50 bg-indigo-900 text-white p-2 rounded-lg hover:bg-indigo-800 transition-colors ${
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
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-purple-700 to-violet-900 text-white p-6 shadow-2xl transition-all duration-500 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 40 }}
      >
        <h2 className="text-3xl font-extrabold mt-8 mb-10"></h2>
        <ul className="space-y-6">
          <li>
            <Link
              to="/User/UserDashboard"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/User/UserDashboard"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/User/UserDashboard")}
            >
              <HomeIcon className="h-6 w-6 mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/User/UserSubscritpion"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/User/UserSubscritpion"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/User/UserSubscritpion")}
            >
              <ClipboardIcon className="h-6 w-6 mr-2" />
              Gym Subscription
            </Link>
          </li>
          <li>
            <Link
              to="/User/UserMembership"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/ManageMembership"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/ManageMembership")}
            >
              <UsersIcon className="h-6 w-6 mr-2" />
              Membership
            </Link>
          </li>
          <li>
            <Link
              to="/User/UserPaymentHistory"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Payment"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Payment")}
            >
              <CreditCardIcon className="h-6 w-6 mr-2" />
              View Payments
            </Link>
          </li>
          <li>
            <Link
              to="/User/AssignedTrainer"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/AssignTrainer"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/AssignTrainer")}
            >
              <UserPlusIcon className="h-6 w-6 mr-2" />
              Assign Trainer
            </Link>
          </li>
          <li>
            <Link
              to="/User/UserWorkoutPlan"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/User/UserWorkoutPlan"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/User/UserWorkoutPlan")}
            >
              <DocumentTextIcon className="h-6 w-6 mr-2" />
              Workout Plan
            </Link>
          </li>
          <li>
            <Link
              to="/User/UserFAQ"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/User/UserFAQ"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/User/UserFAQ")}
            >
              <QuestionMarkCircleIcon className="h-6 w-6 mr-2" />
              FAQ
            </Link>
          </li>
          <li>
            <Link
              to="/User/UserFeedback"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Feedback"
                  ? "bg-violet-600/70 text-white"
                  : "hover:bg-violet-600/50 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Feedback")}
            >
              <EnvelopeIcon className="h-6 w-6 mr-2" />
              Feedback
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-500 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        {children}
      </main>
    </div>  
  );
};

export default UserSidebar;