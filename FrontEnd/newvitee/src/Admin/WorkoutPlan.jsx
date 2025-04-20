import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from 'axios';

const ManageExerciseAndWorkoutPlan = () => {
    // States for managing exercises and form input
    const [exercises, setExercises] = useState([]);
    const [newExercise, setNewExercise] = useState({
        name: "",
        reps: "",
        sets: "",
        duration: ""
    });
    const [editingExercise, setEditingExercise] = useState(false);
    const [currentExercise, setCurrentExercise] = useState(null);

    // States for managing workout plans
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [newWorkoutPlan, setNewWorkoutPlan] = useState({
        name: "",
        seven_days: Array(7).fill([])
    });
    const [editingWorkoutPlan, setEditingWorkoutPlan] = useState(false);
    const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);

    // States for temporarily storing selected exercises for each day
    const [selectedExercises, setSelectedExercises] = useState(Array(7).fill(''));

    // States for managing users and assigning plans
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState(null);

    useEffect(() => {
        fetchExercises();
        fetchWorkoutPlans();
        fetchUsers();
    }, []);

    // Fetch exercises from backend
    const fetchExercises = async () => {
        try {
            const response = await axios.get('http://localhost:4000/exercise/get-exercise',{
                withCredentials : true
            });
            setExercises(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch workout plans from backend
    const fetchWorkoutPlans = async () => {
        try {
            const response = await axios.get('http://localhost:4000/WO-plan/get-plan',{
                withCredentials : true
            });
            setWorkoutPlans(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch users from backend
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/auth/User/get-users',{
                withCredentials : true
            });
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Handle form input changes for exercises
    const handleExerciseInputChange = (e) => {
        const { name, value } = e.target;
        setNewExercise({ ...newExercise, [name]: value });
    };

    // Handle form submission for adding or updating an exercise
    const handleExerciseFormSubmit = (e) => {
        e.preventDefault();

        if (editingExercise) {
            // Update the exercise
            axios.put(`http://localhost:4000/exercise/update-exercise/${currentExercise._id}`, newExercise,{
                withCredentials : true
            })
                .then(() => {
                    fetchExercises();
                    setEditingExercise(false);
                    setCurrentExercise(null);
                    setNewExercise({ name: "", reps: "", sets: "", duration: "" });
                })
                .catch(error => console.error(error));
        } else {
            // Add a new exercise
            axios.post('http://localhost:4000/exercise/add-exercise', newExercise,{
                withCredentials : true
            })
                .then(() => {
                    fetchExercises();
                    setNewExercise({ name: "", reps: "", sets: "", duration: "" });
                })
                .catch(error => console.error(error));
        }
    };

    // Handle edit button click for exercises
    const handleEditExercise = (exercise) => {
        setEditingExercise(true);
        setCurrentExercise(exercise);
        setNewExercise({
            name: exercise.name,
            reps: exercise.reps,
            sets: exercise.sets,
            duration: exercise.duration
        });
    };

    // Handle delete button click for exercises
    const handleDeleteExercise = (id) => {
        axios.delete(`http://localhost:4000/exercise/delete-exercise/${id}`,{
            withCredentials : true
        })
            .then(() => fetchExercises())
            .catch(error => console.error(error));
    };

    // Handle form input changes for workout plans
    const handleWorkoutPlanInputChange = (e) => {
        const { name, value } = e.target;
        setNewWorkoutPlan(prev => ({ ...prev, [name]: value }));
    };

    // Handle selecting an exercise for a specific day
    const handleSelectExerciseForDay = (dayIndex, exerciseId) => {
        setSelectedExercises(prev => {
            const updatedSelectedExercises = [...prev];
            updatedSelectedExercises[dayIndex] = exerciseId; // Store just one selected exerciseId
            return updatedSelectedExercises;
        });
    };

    // Handle adding selected exercises to a specific day
    const handleAddSelectedExercisesToDay = (dayIndex) => {
        setNewWorkoutPlan(prev => {
            const updatedSevenDays = [...prev.seven_days];
            const exerciseId = selectedExercises[dayIndex]; // Get the selected exerciseId
            if (exerciseId) {
                updatedSevenDays[dayIndex] = [...updatedSevenDays[dayIndex], exerciseId];
            }
            return { ...prev, seven_days: updatedSevenDays };
        });

        // Clear selected exercise after adding
        setSelectedExercises(prev => {
            const updatedSelectedExercises = [...prev];
            updatedSelectedExercises[dayIndex] = ''; // Clear the selected exercise
            return updatedSelectedExercises;
        });
    };

    // Handle form submission for adding or updating a workout plan
    const handleWorkoutPlanFormSubmit = async (e) => {
        e.preventDefault();

        const seven_days = newWorkoutPlan.seven_days.map(day => {
            return day.map(exerciseId => exerciseId)
        })

        if (editingWorkoutPlan) {
            // Update the workout plan
            axios.put(`http://localhost:4000/WO-plan/update-plan/${currentWorkoutPlan._id}`, { ...newWorkoutPlan, seven_days },{
                withCredentials : true
            })
                .then(() => {
                    fetchWorkoutPlans();
                    setEditingWorkoutPlan(false);
                    setCurrentWorkoutPlan(null);
                    setNewWorkoutPlan({ name: "", seven_days: Array(7).fill([]) });
                })
                .catch(error => console.error(error));
        } else {
            // Add a new workout plan
            axios.post('http://localhost:4000/WO-plan/add-plan', { ...newWorkoutPlan, seven_days },{
                withCredentials : true
            })
                .then(() => {
                    fetchWorkoutPlans();
                    setNewWorkoutPlan({ name: "", seven_days: Array(7).fill([]) });
                })
                .catch(error => console.error(error));
        }
    };

    // Handle edit button click for workout plans
    const handleEditWorkoutPlan = (workoutPlan) => {
        setEditingWorkoutPlan(true);
        setCurrentWorkoutPlan(workoutPlan);
        setNewWorkoutPlan({
            name: workoutPlan.name,
            seven_days: workoutPlan.seven_days
        });
    };

    // Handle delete button click for workout plans
    const handleDeleteWorkoutPlan = (id) => {
        axios.delete(`http://localhost:4000/WO-plan/delete-plan/${id}`,{
            withCredentials : true
        })
            .then(() => fetchWorkoutPlans())
            .catch(error => console.error(error));
    };

    // Handle assigning a workout plan to a user
    const handleAssignWorkoutPlan = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:4000/WO-plan/assign-WOPlan/${selectedUser._id}`,
            { WorkoutPlanId: selectedWorkoutPlan._id },{
            withCredentials : true
        })
            .then(() => console.log('Workout plan assigned successfully'))
            .catch(error => console.error(error));
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Workout Plans and Exercises</h1>

            {/* Exercise Management */}
            <motion.div>
                {/* Form to Add or Update Exercise */}
                <motion.form
                    onSubmit={handleExerciseFormSubmit}
                    className="bg-white p-6 rounded-lg shadow-md mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold mb-4">{editingExercise ? "Edit Exercise" : "Add New Exercise"}</h2>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newExercise.name}
                            onChange={handleExerciseInputChange}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="reps" className="block text-gray-700">Reps</label>
                        <input
                            type="number"
                            id="reps"
                            name="reps"
                            value={newExercise.reps}
                            onChange={handleExerciseInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="sets" className="block text-gray-700">Sets</label>
                        <input
                            type="number"
                            id="sets"
                            name="sets"
                            value={newExercise.sets}
                            onChange={handleExerciseInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="duration" className="block text-gray-700">Duration (minutes)</label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={newExercise.duration}
                            onChange={handleExerciseInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        {editingExercise ? "Update Exercise" : "Add Exercise"}
                    </button>
                </motion.form>

                {/* List of Exercises */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold mb-4">All Exercises</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">Reps</th>
                                    <th className="py-2 px-4 text-left">Sets</th>
                                    <th className="py-2 px-4 text-left">Duration (min)</th>
                                    <th className="py-2 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercises.map(ex => (
                                    <tr key={ex._id} className="border-b">
                                        <td className="py-2 px-4">{ex.name}</td>
                                        <td className="py-2 px-4">{ex.reps}</td>
                                        <td className="py-2 px-4">{ex.sets}</td>
                                        <td className="py-2 px-4">{ex.duration}</td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => handleEditExercise(ex)}
                                                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExercise(ex._id)}
                                                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>

            {/* Workout Plan Management */}
            <motion.div>
                {/* Form to Add or Update Workout Plan */}
                <motion.form
                    onSubmit={handleWorkoutPlanFormSubmit}
                    className="bg-white p-6 rounded-lg shadow-md mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold mb-4">{editingWorkoutPlan ? "Edit Workout Plan" : "Add New Workout Plan"}</h2>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newWorkoutPlan.name}
                            onChange={handleWorkoutPlanInputChange}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    {/* Day-wise Exercise Selection */}
                    {newWorkoutPlan.seven_days.map((day, dayIndex) => (
                        <div key={dayIndex} className="mb-4">
                            <label className="block text-gray-700">Day {dayIndex + 1}</label>
                            <select
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                onChange={(e) => {
                                    handleSelectExerciseForDay(dayIndex, e.target.value);
                                }}
                                value={selectedExercises[dayIndex] || ''} // Controlled component
                            >
                                <option value="">Select an Exercise</option>
                                {exercises.map(exercise => (
                                    <option key={exercise._id} value={exercise._id}>
                                        {exercise.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => handleAddSelectedExercisesToDay(dayIndex)}
                                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-2"
                            >
                                Add Exercise to Day
                            </button>

                            {/* Display exercises added to this day */}
                            <div>
                                <p>Exercises for Day {dayIndex + 1}:</p>
                                <ul>
                                    {day.map(exerciseId => {
                                        const exercise = exercises.find(ex => ex._id === exerciseId);
                                        return exercise ? <li key={exercise._id}>{exercise.name}</li> : null;
                                    })}
                                </ul>
                            </div>
                        </div>
                    ))}

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        {editingWorkoutPlan ? "Update Workout Plan" : "Add Workout Plan"}
                    </button>
                </motion.form>

                {/* List of Workout Plans */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold mb-4">All Workout Plans</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">Days</th>
                                    <th className="py-2 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workoutPlans.map(plan => (
                                    <tr key={plan._id} className="border-b">
                                        <td className="py-2 px-4">{plan.name}</td>
                                        <td className="py-2 px-4">
                                            {plan.seven_days.map((day, index) => (
                                                <div key={index}>
                                                    Day {index + 1}: {day.map(exerciseId => {
                                                        const exercise = exercises.find(ex => ex._id === exerciseId);
                                                        return exercise ? exercise.name : null;
                                                    }).join(', ')}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => handleEditWorkoutPlan(plan)}
                                                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWorkoutPlan(plan._id)}
                                                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>

            {/* User Management and Workout Plan Assignment */}
            <motion.div>
                <h2 className="text-2xl font-semibold mb-4">User Management and Workout Plan Assignment</h2>

                {/* User Selection */}
                <div className="mb-4">
                    <label htmlFor="userSelect" className="block text-gray-700">Select User:</label>
                    <select
                        id="userSelect"
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                        onChange={(e) => {  
                            const selectedUserId = e.target.value;
                            const user = users.find(user => user._id === selectedUserId);
                            setSelectedUser(user);
                        }}
                        value={selectedUser ? selectedUser._id : ''}
                        style={{ color: 'black', backgroundColor: 'white' }} // Inline styles applied here
                    >
                        <option value="">Select a User</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.first_name} {user.last_name}</option>
                        ))}
                    </select>
                </div>

                {/* Workout Plan Selection */}
                <div className="mb-4">
                    <label htmlFor="workoutPlanSelect" className="block text-gray-700">Select Workout Plan:</label>
                    <select
                        id="workoutPlanSelect"
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                        onChange={(e) => {
                            const selectedPlanId = e.target.value;
                            const plan = workoutPlans.find(plan => plan._id === selectedPlanId);
                            setSelectedWorkoutPlan(plan);
                        }}
                        value={selectedWorkoutPlan ? selectedWorkoutPlan._id : ''}
                    >
                        <option value="">Select a Workout Plan</option>
                        {workoutPlans.map(plan => (
                            <option key={plan._id} value={plan._id}>{plan.name}</option>
                        ))}
                    </select>
                </div>

                {/* Assign Workout Plan Form */}
                <form onSubmit={handleAssignWorkoutPlan}>
                    <button
                        type="submit"
                        disabled={!selectedUser || !selectedWorkoutPlan}
                        className={`bg-purple-500 text-white p-2 rounded hover:bg-purple-600 ${(!selectedUser || !selectedWorkoutPlan) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Assign Workout Plan to User
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ManageExerciseAndWorkoutPlan;
