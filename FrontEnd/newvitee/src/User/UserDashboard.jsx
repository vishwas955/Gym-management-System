import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt, FaDumbbell, FaWeight, FaRulerVertical } from "react-icons/fa";

const UserDashboard = () => {
    const [date, setDate] = useState(new Date());
    const [quote, setQuote] = useState("");
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState("");

    const quotes = [
        "🔥 Push yourself because NO ONE else is going to do it for you! ",
        "💪 Success starts with SELF-DISCIPLINE! ",
        "🚀 It ALWAYS seems IMPOSSIBLE until it's DONE! ",
        "🏋‍♂ The BODY achieves what the MIND believes! ",
        "🏆 Don't STOP when you're TIRED. STOP when you're DONE! ",
        "🙌 BELIEVE in yourself and ALL that you are! ",
        "💥 Strength doesn't come from what you CAN do. It comes from OVERCOMING what you once thought you COULDN'T. "
    ];

    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    useEffect(() => {
        const fetchWorkoutPlan = async () => {
            try {
                const response = await axios.get("http://localhost:4000/WO-plan/get-user-plan", {
                    withCredentials: true,
                });

                if (!response.data.success) {
                    throw new Error(response.data.message);
                }

                setWorkoutPlan(response.data.workoutPlan.seven_days);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to fetch workout plan.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkoutPlan();
    }, []);

    const getWorkoutForSelectedDay = () => {
        if (!workoutPlan) return null;

        const dayIndex = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        return workoutPlan[dayIndex];
    };

    const calculateBMI = () => {
        if (!height || !weight) return;
        
        const heightInMeters = height / 100;
        const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setBmi(bmiValue);
        
        // Determine BMI category
        if (bmiValue < 18.5) {
            setBmiCategory("Underweight");
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
            setBmiCategory("Normal weight");
        } else if (bmiValue >= 25 && bmiValue < 30) {
            setBmiCategory("Overweight");
        } else {
            setBmiCategory("Obese");
        }
    };

    const getBmiColor = () => {
        if (!bmi) return "";
        if (bmi < 18.5) return "text-blue-600";
        if (bmi < 25) return "text-green-600";
        if (bmi < 30) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="p-6 bg-indigo-100 min-h-screen">
            {/* Welcome Section */}
            <motion.div 
                className="bg-gradient-to-r from-purple-400 to-indigo-600 text-white p-8 rounded-lg shadow-xl text-center mb-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-left">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FaDumbbell className="text-yellow-400" /> Hello Buddy!!! WELCOME BACK!!!
                    </h1>
                    <p className="text-lg mt-2">Stay fit and keep pushing your limits! 💪</p>
                </div>
            </motion.div>

            {/* Motivational Quote Card */}
            <motion.div 
                className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-xl text-center max-w-4xl mx-auto mb-6"
                whileHover={{ scale: 1.05, rotate: 1, filter: "brightness(1.2)" }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl font-semibold">Inspiration of the Day</h2>
                <p className="text-lg font-bold mt-3">{quote}</p>
            </motion.div>

            {/* BMI Calculator Section - Moved to middle */}
            <motion.div
                className="bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-indigo-600 text-center mb-4">BMI Calculator</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <FaRulerVertical className="text-indigo-500" />
                            <label className="text-gray-700">Height (cm)</label>
                        </div>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter height in cm"
                        />

                        <div className="flex items-center space-x-2">
                            <FaWeight className="text-indigo-500" />
                            <label className="text-gray-700">Weight (kg)</label>
                        </div>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter weight in kg"
                        />

                        <button
                            onClick={calculateBMI}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors"
                        >
                            Calculate BMI
                        </button>
                    </div>

                    {bmi && (
                        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your BMI Result</h3>
                            <div className={`text-4xl font-bold ${getBmiColor()} mb-2`}>{bmi}</div>
                            <div className="text-lg font-medium text-gray-600">{bmiCategory}</div>
                            <div className="mt-4 text-sm text-gray-500">
                                {bmiCategory === "Underweight" && "Consider increasing your calorie intake and strength training"}
                                {bmiCategory === "Normal weight" && "Great job! Maintain your healthy lifestyle"}
                                {bmiCategory === "Overweight" && "Consider more cardio and balanced diet"}
                                {bmiCategory === "Obese" && "Consult with a healthcare professional for guidance"}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Workout Plan Section */}
            <motion.div 
                className="bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-indigo-600 text-center mb-4">Workout Plan for Selected Day</h2>
                {loading ? (
                    <p className="text-center text-gray-600">Loading workout plan...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="grid gap-4">
                        {getWorkoutForSelectedDay()?.map((exercise) => (
                            <motion.div 
                                key={exercise._id} 
                                className="bg-gradient-to-br from-blue-100 to-blue-300 p-4 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
                                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-lg font-semibold text-blue-800">{exercise.name}</h3>
                                <p className="text-gray-700">{exercise.reps} reps, {exercise.sets} sets, {exercise.duration} mins</p>
                            </motion.div>
                        )) || <p className="text-center text-gray-500">No workout assigned for this day.</p>}
                    </div>
                )}
            </motion.div>

            {/* Calendar Section */}
            <motion.div
                className="bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto flex flex-col items-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
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

export default UserDashboard;