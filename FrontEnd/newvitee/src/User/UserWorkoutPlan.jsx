import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserWorkoutPlan = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await axios.get("http://localhost:4000/WO-plan/get-user-plan", {
          withCredentials: true,
        });

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        setWorkoutPlan(response.data.workoutPlan);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch workout plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading Workout Plan...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Workout Plan</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Display workouts for each day */}
        {workoutPlan.seven_days.map((dayExercises, index) => (
          <div key={index} className="bg-gray-100 p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">Day {index + 1}</h3>
            <ul className="list-none mt-4">
              {dayExercises.map((exercise) => (
                <li key={exercise._id} className="text-lg text-gray-700 mb-2 flex items-center">
                  {/* Displaying exercise name with reps, sets, and duration */}
                  <span>{exercise.name}: {exercise.reps} reps, {exercise.sets} sets, {exercise.duration} mins</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserWorkoutPlan;
