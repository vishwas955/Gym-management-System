import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => { return (
  <aside className="w-64 bg-blue-900 text-white p-6 shadow-2xl">
    <h2 className="text-3xl font-extrabold mb-10">Caliber Fitness </h2>
    <ul className="space-y-6">
      <li>
        <Link to="/Dashboard" className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/ManageSubscription" className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium">
            Manage Subscription
          </Link>
      </li>
      <li>
        <Link to="/ManageMembership" className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium">
        Manage Membership
        </Link>
      </li>
      <li>
      <Link to="/Payment"
        className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium"
      >
        View payments
      </Link>
      </li>
      <li>
      <Link to="/AssignTrainer"
        className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium"
      >
        Assign Trainer
      </Link>
      </li>
      <li>
      <Link to="/Workoutplan"
        className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium"
      >
        Workout Plan
      </Link>
      </li>
      <li>
      <Link to="/Faq"
        className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium"
      >
        FAQ
      </Link>
      </li>
      <li>
      <Link to="/Feedback"
        className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium"
      >
        Feedback
      </Link>
      </li>
    </ul>
  </aside>
);};
export default Sidebar;