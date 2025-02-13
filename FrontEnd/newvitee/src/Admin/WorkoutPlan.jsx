import React, { useState } from "react";
import { motion } from "framer-motion";

const ManageExercise = () => {
  // States for managing exercises and form input
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({
    name: "",
    reps: "",
    sets: "",
    duration: ""
  });
  const [editing, setEditing] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({ ...newExercise, [name]: value });
  };

  // Handle form submission for adding or updating an exercise
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editing) {
      // Update the exercise
      setExercises(exercises.map(ex => ex.name === currentExercise.name ? newExercise : ex));
      setEditing(false);
      setCurrentExercise(null);
      setNewExercise({ name: "", reps: "", sets: "", duration: "" });
    } else {
      // Add a new exercise with auto-generated id based on array length
      setExercises([...exercises, { ...newExercise, id: exercises.length + 1 }]);
      setNewExercise({ name: "", reps: "", sets: "", duration: "" });
    }
  };

  // Handle edit button click
  const handleEdit = (exercise) => {
    setEditing(true);
    setCurrentExercise(exercise);
    setNewExercise({
      name: exercise.name,
      reps: exercise.reps,
      sets: exercise.sets,
      duration: exercise.duration
    });
  };

  // Handle delete button click
  const handleDelete = (name) => {
    setExercises(exercises.filter(ex => ex.name !== name));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Exercises</h1>

      {/* Form to Add or Update Exercise */}
      <motion.form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Exercise" : "Add New Exercise"}</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newExercise.name}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {editing ? "Update Exercise" : "Add Exercise"}
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
                <tr key={ex.name} className="border-b">
                  <td className="py-2 px-4">{ex.name}</td>
                  <td className="py-2 px-4">{ex.reps}</td>
                  <td className="py-2 px-4">{ex.sets}</td>
                  <td className="py-2 px-4">{ex.duration}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleEdit(ex)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ex.name)}
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
    </div>
  );
};

export default ManageExercise;
