import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa";

const TrainerDashboard = () => {
    const [totalMembers, setTotalMembers] = useState(0);
    const [assignedMembersCount, setAssignedMembersCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date());
    const [quote, setQuote] = useState("");

    const quotes = [
        "🔥 Push yourself because NO ONE else is going to do it for you! ",
        "💪 Success starts with SELF-DISCIPLINE! ",
        "🚀 It ALWAYS seems IMPOSSIBLE until it’s DONE! ",
        "🏋️‍♂️ The BODY achieves what the MIND believes! ",
        "🏆 Don’t STOP when you’re TIRED. STOP when you’re DONE! ",
        "🙌 BELIEVE in yourself and ALL that you are! ",
        "💥 Strength doesn’t come from what you CAN do. It comes from OVERCOMING what you once thought you COULDN’T. "
    ];

    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const totalRes = await axios.get("http://localhost:4000/auth/User/get-users", { withCredentials: true });
                setTotalMembers(totalRes.data.length); // Count total users
                
                const assignedRes = await axios.get("http://localhost:4000/trainer/get-assigned-members", { withCredentials: true });
                setAssignedMembersCount(assignedRes.data.total);
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
                    <h1 className="text-3xl font-bold">Hi, Trainer!</h1>
                    <p className="text-lg mt-2">Welcome back! Ready to train your members today?</p>
                </div>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" 
                    alt="Trainer Illustration" 
                    className="w-28 h-28 mt-4 md:mt-0"
                />
            </motion.div>

            <motion.div 
                className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-xl text-center max-w-4xl mx-auto mb-6"
                whileHover={{ scale: 1.05, rotate: 1, filter: "brightness(1.2)" }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl font-semibold"> Inspiration of the Day </h2>
                <p className="text-lg font-bold mt-3">{quote}</p>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                <motion.div 
                    className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white p-6 rounded-lg shadow-xl text-center cursor-pointer"
                    whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-semibold">Total Members</h2>
                    <p className="text-4xl font-bold">{loading ? "Loading..." : totalMembers}</p>
                </motion.div>
                
                <motion.div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-xl text-center cursor-pointer"
                    whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-semibold">Assigned Members</h2>
                    <p className="text-4xl font-bold">{loading ? "Loading..." : assignedMembersCount}</p>
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

export default TrainerDashboard;