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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("/AdminDashboard");
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleItemClick = (path) => {
    setActiveItem(path);
  }
  return (
    <div className="flex">
      {/* Sidebar Toggle Buttons */}
      <button
        className={`fixed top-4 left-4 z-10 bg-indigo-900 text-white p-2 rounded-lg hover:bg-indigo-800 transition-colors ${
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
        className={`fixed top-4 left-4 z-10 bg-indigo-900 text-white p-2 rounded-lg hover:bg-indigo-800 transition-colors ${
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
        className={`w-64 bg-indigo-900 text-white p-6 shadow-2xl transition-width duration-500 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <h2 className="text-3xl font-extrabold mt-8 mb-10">Hello Admin</h2>
        <ul className="space-y-6">
          <li>
            <Link
              to="/AdminDashboard"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/AdminDashboard"
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/AdminDashboard")}
            >
              <HomeIcon className="h-6 w-6 mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/ManageSubscription"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/ManageSubscription"
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/ManageSubscription")}
            >
              <ClipboardIcon className="h-6 w-6 mr-2" />
              Gym Subscription
            </Link>
          </li>
          <li>
            <Link
              to="/ManageMembership"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/ManageMembership"
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/ManageMembership")}
            >
              <UsersIcon className="h-6 w-6 mr-2" />
            Membership
            </Link>
          </li>
          <li>
            <Link
              to="/Payment"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Payment"
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Payment")}
            >
              <CreditCardIcon className="h-6 w-6 mr-2" />
              View Payments
            </Link>
          </li>
          <li>
            <Link
              to="/AssignTrainer"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/AssignTrainer"
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/AssignTrainer")}
            >
              <UserPlusIcon className="h-6 w-6 mr-2" />
              Assign Trainer
            </Link>
          </li>
          <li>
            <Link
              to="/Workoutplan"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Workoutplan"
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Workoutplan")}
            >
              <DocumentTextIcon className="h-6 w-6 mr-2" />
              Workout Plan
            </Link>
          </li>
          <li>
            <Link
              to="/Faq"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Faq"
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Faq")}
            >
              <QuestionMarkCircleIcon className="h-6 w-6 mr-2" />
              FAQ
            </Link>
          </li>
          <li>
            <Link
              to="/Feedback"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                activeItem === "/Feedback"
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800 text-white"
              } flex items-center`}
              onClick={() => handleItemClick("/Feedback")}
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

export default Sidebar;
