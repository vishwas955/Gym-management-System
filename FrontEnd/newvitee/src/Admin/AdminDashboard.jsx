import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AdminDashboard = () => {
  const [membersCount, setMembersCount] = useState(0);
  const [trainerCount, setTrainersCount] = useState(0);

  useEffect(() => {
    const fetchMembersCount = async () => {
      try {
        const response = await axios.get("http://localhost:4000/auth/User/get-users", 
          {withCredentials : true }
        ); // Replace with your actual endpoint
        if (response.data) {
          setMembersCount(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembersCount();
  }, []);

  useEffect(() => {
    const fetchTrainersCount = async () => {
      try {
        const response = await axios.get("http://localhost:4000/trainer/get-trainers", 
          {withCredentials : true }
        ); // Replace with your actual endpoint
        if (response.data) {
          setTrainersCount(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching Trainers:", error);
      }
    };
    fetchTrainersCount();
  }, []);

  

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

        {/* Total Trainers */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Total Trainers</h2>
          <p className="text-3xl font-bold">{trainerCount }</p>
        </div>
      </motion.div>
    </div>
    
      
  );
};

export default AdminDashboard;
