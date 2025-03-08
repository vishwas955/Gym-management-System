import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const TrSidebar = () => { return (
  <aside className="w-64 bg-blue-900 text-white p-6 shadow-2xl">
    <h2 className="text-3xl font-extrabold mb-10"> Caliber Fitness</h2>
    <ul className="space-y-6">
      <li>
        <Link to="/Trainer/TrainerDashboard" className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium">
          Dashboard
        </Link>
      </li>
      {/* <li>
        <Link to="/TrMember" className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium">
          Assigned Members
        </Link>
      </li> */}
      <li>
        <Link to="/Trainer/Profile" className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium">
        TrainerProfile
        </Link>
      </li>
      <li>
      <Link to="/Trainer/TrWkPlan"
        className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium"
      >
        Workout Plan
      </Link>
      </li>
      <li>
      <Link to="/Trainer/Feedback"
        className="block py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-lg font-medium"
      >
        Feedback
      </Link>
      </li>
    </ul>
  </aside>
);};
export default TrSidebar;