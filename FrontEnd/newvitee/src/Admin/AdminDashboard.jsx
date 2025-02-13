import React, { useState } from "react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  // Dummy data
  const [membersCount, setMembersCount] = useState(10);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Dashboard Summary */}
      <motion.div
        className="grid grid-cols-1 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Total Members */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Total Members</h2>
          <p className="text-3xl font-bold">{membersCount}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
