import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const [membersCount, setMembersCount] = useState(0);
  const [trainerCount, setTrainerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const membersRes = await axios.get("http://localhost:4000/auth/User/get-users", { withCredentials: true });
        setMembersCount(membersRes.data.length);

        const trainersRes = await axios.get("http://localhost:4000/trainer/get-trainers", { withCredentials: true });
        setTrainerCount(trainersRes.data.length);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-indigo-100 min-h-screen">
      <motion.div 
        className="bg-gradient-to-r from-purple-400 to-indigo-600 text-white p-8 rounded-lg shadow-xl text-center mb-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-left">
          <h1 className="text-3xl font-bold">Welcome, Admin!</h1>
          <p className="text-lg mt-2">Manage your gym efficiently!</p>
        </div>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" 
          alt="Admin Illustration" 
          className="w-28 h-28 mt-4 md:mt-0"
        />
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
        <motion.div 
          className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white p-6 rounded-lg shadow-xl text-center cursor-pointer"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold">Total Members</h2>
          <p className="text-4xl font-bold">{loading ? "Loading..." : membersCount}</p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-xl text-center cursor-pointer"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold">Total Trainers</h2>
          <p className="text-4xl font-bold">{loading ? "Loading..." : trainerCount}</p>
        </motion.div>
      </motion.div>

      <motion.div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto flex flex-col items-center">
        <div className="flex items-center text-indigo-600 mb-4">
          <FaCalendarAlt className="h-8 w-8 mr-2" />
          <h2 className="text-2xl font-semibold">Calendar</h2>
        </div>
        <Calendar 
          onChange={setDate} 
          value={date}
          className="rounded-lg shadow-md border border-gray-200 w-full max-w-lg"
        />
        <p className="mt-4 text-lg text-gray-600 font-medium text-center">
          Selected Date: <span className="text-indigo-600 font-semibold">{date.toDateString()}</span>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
