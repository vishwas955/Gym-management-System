import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

const TrSidebar = () => {
  const [activeItem, setActiveItem] = useState("/TrainerDashboard");

  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  return (
    <aside className="fixed w-64 bg-indigo-900 text-white p-6 sticky top-0 h-screen shadow-2xl">
      <h2 className="text-3xl font-extrabold mb-10">Caliber Fitness</h2>
      <ul className="space-y-6">
        <li>
          <Link
            to="/Trainer/TrainerDashboard"
            className={`block py-3 px-4 rounded-lg transition-colors flex items-center text-lg font-medium ${
              activeItem === "/Trainer/TrainerDashboard" ? "bg-indigo-600" : "hover:bg-indigo-600"
            }`}
            onClick={() => handleItemClick("/Trainer/TrainerDashboard")}
          >
            <HomeIcon className="h-6 w-6 mr-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/Trainer/assignedmembers"
            className={`block py-3 px-4 rounded-lg transition-colors flex items-center text-lg font-medium ${
              activeItem === "/Trainer/assignedmembers" ? "bg-indigo-600" : "hover:bg-indigo-600"
            }`}
            onClick={() => handleItemClick("/Trainer/assignedmembers")}
          >
            <UserGroupIcon className="h-6 w-6 mr-2" />
            Assigned Members
          </Link>
        </li>
        <li>
          <Link
            to="/Trainer/TrWkPlan"
            className={`block py-3 px-4 rounded-lg transition-colors flex items-center text-lg font-medium ${
              activeItem === "/Trainer/TrWkPlan" ? "bg-indigo-600" : "hover:bg-indigo-600"
            }`}
            onClick={() => handleItemClick("/Trainer/TrWkPlan")}
          >
            <DocumentTextIcon className="h-6 w-6 mr-2" />
            Workout Plan
          </Link>
        </li>
        <li>
          <Link
            to="/Trainer/Feedback"
            className={`block py-3 px-4 rounded-lg transition-colors flex items-center text-lg font-medium ${
              activeItem === "/Trainer/TrFeedback" ? "bg-indigo-600" : "hover:bg-indigo-600"
            }`}
            onClick={() => handleItemClick("/Trainer/TrFeedback")}
          >
            <EnvelopeIcon className="h-6 w-6 mr-2" />
            Feedback
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default TrSidebar;
