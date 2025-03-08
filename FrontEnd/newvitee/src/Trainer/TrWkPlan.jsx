import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AssignWorkoutPlan = () => {
    const [members, setMembers] = useState([]);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' }); // Store text & type ('success' or 'error')

    useEffect(() => {
        fetchMembers();
        fetchWorkoutPlans();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/auth/User/get-users', { withCredentials: true });
            setMembers(response.data);
        } catch (error) {
            setMessage({ text: 'Error fetching members.', type: 'error' });
        }
    };

    const fetchWorkoutPlans = async () => {
        try {
            const response = await axios.get('http://localhost:4000/WO-plan/get-plan', { withCredentials: true });
            setWorkoutPlans(response.data);
        } catch (error) {
            setMessage({ text: 'Error fetching workout plans.', type: 'error' });
        }
    };

    const handleAssignWorkoutPlan = async () => {
        try {
            if (!selectedMember || !selectedWorkoutPlan) {
                setMessage({ text: 'Please select a member and a workout plan.', type: 'error' });
                return;
            }

            const response = await axios.put(
                `http://localhost:4000/WO-plan/assign-WOPlan/${selectedMember}`,
                { WorkoutPlanId: selectedWorkoutPlan },
                { withCredentials: true }
            );

            if (response.data.success) {
                setMessage({ text: 'Workout plan assigned successfully!', type: 'success' });
            } else {
                setMessage({ text: response.data.message || 'Failed to assign workout plan.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error assigning workout plan.', type: 'error' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg"
        >
            <h2 className="text-2xl font-semibold mb-4">Assign Workout Plan to Member</h2>

            {/* Message Box with Dynamic Colors */}
            {message.text && (
                <div className={`mb-4 p-3 border rounded text-center ${
                    message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Member Selection */}
            <div className="mb-4">
                <label htmlFor="member" className="block text-gray-700 text-sm font-bold mb-2">Select Member:</label>
                <select
                    id="member"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                >
                    <option value="">Select Member</option>
                    {members.map((member) => (
                        <option key={member._id} value={member._id}>
                            {member.first_name} {member.last_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Workout Plan Selection */}
            <div className="mb-4">
                <label htmlFor="workoutPlan" className="block text-gray-700 text-sm font-bold mb-2">Select Workout Plan:</label>
                <select
                    id="workoutPlan"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedWorkoutPlan}
                    onChange={(e) => setSelectedWorkoutPlan(e.target.value)}
                >
                    <option value="">Select Workout Plan</option>
                    {workoutPlans.map((plan) => (
                        <option key={plan._id} value={plan._id}>
                            {plan.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Assign Button */}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleAssignWorkoutPlan}
            >
                Assign Workout Plan
            </button>
        </motion.div>
    );
};

export default AssignWorkoutPlan;
