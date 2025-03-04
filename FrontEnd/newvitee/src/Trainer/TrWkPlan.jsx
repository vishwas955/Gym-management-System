import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Calendar, Edit2, Trash2, X, Plus, Save, XCircle } from 'lucide-react';
import axios from 'axios';

const WorkoutPlans = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isTrainerMode, setIsTrainerMode] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editedPlanData, setEditedPlanData] = useState({});
  const [newPlan, setNewPlan] = useState({ name: '', type: '', description: '', days: '' });
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [editingExercises, setEditingExercises] = useState(null);
  const [editedExercisesData, setEditedExercisesData] = useState([]);
  const [detailedExercises, setDetailedExercises] = useState({});

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  // Fetch all workout plans
  const fetchWorkoutPlans = async () => {
    try {
      const response = await axios.get('/api/workout-plans');
      setWorkoutPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      setLoading(false);
    }
  };

  // Fetch exercises for a specific plan
  const fetchExercisesForPlan = async (planId) => {
    try {
      const response = await axios.get(`/api/workout-plans/${planId}/exercises`);
      setDetailedExercises((prev) => ({ ...prev, [planId]: response.data }));
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  // Handle editing a workout plan
  const handleEditPlan = (plan) => {
    setEditingPlan(plan.id);
    setEditedPlanData({ ...plan });
  };

  // Save the edited workout plan
  const handleSavePlan = async () => {
    try {
      await axios.put(`/api/workout-plans/${editingPlan}`, editedPlanData);
      const updatedPlans = workoutPlans.map((plan) =>
        plan.id === editingPlan ? { ...editedPlanData } : plan
      );
      setWorkoutPlans(updatedPlans);
      setEditingPlan(null);
    } catch (error) {
      console.error('Error updating workout plan:', error);
    }
  };

  // Delete a workout plan
  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`/api/workout-plans/${planId}`);
      setWorkoutPlans(workoutPlans.filter((plan) => plan.id !== planId));
      const updatedExercises = { ...detailedExercises };
      delete updatedExercises[planId];
      setDetailedExercises(updatedExercises);
    } catch (error) {
      console.error('Error deleting workout plan:', error);
    }
  };

  // Handle editing exercises for a plan
  const handleEditExercises = (planId) => {
    setEditingExercises(planId);
    setEditedExercisesData([...detailedExercises[planId]]);
  };

  // Save the edited exercises
  const handleSaveExercises = async () => {
    try {
      await axios.put(`/api/workout-plans/${editingExercises}/exercises`, editedExercisesData);
      setDetailedExercises((prev) => ({ ...prev, [editingExercises]: editedExercisesData }));
      setEditingExercises(null);
      setEditedExercisesData([]);
    } catch (error) {
      console.error('Error saving exercises:', error);
    }
  };

  // Add a new exercise to the list
  const handleAddExercise = () => {
    setEditedExercisesData([...editedExercisesData, { exercise: '', sets: '', reps: '' }]);
  };

  // Delete an exercise from the list
  const handleDeleteExercise = (index) => {
    const updatedExercises = editedExercisesData.filter((_, i) => i !== index);
    setEditedExercisesData(updatedExercises);
  };

  // Create a new workout plan
  const handleCreatePlan = async () => {
    try {
      const response = await axios.post('/api/workout-plans', newPlan);
      setWorkoutPlans([...workoutPlans, response.data]);
      setDetailedExercises((prev) => ({ ...prev, [response.data.id]: [] }));
      setShowAddPlanForm(false);
      setNewPlan({ name: '', type: '', description: '', days: '' });
    } catch (error) {
      console.error('Error creating workout plan:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Workout Plans</h1>
          <button
            onClick={() => setIsTrainerMode(!isTrainerMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isTrainerMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isTrainerMode ? 'Trainer Mode Active' : 'Enable Trainer Mode'}
          </button>
        </div>

        {/* Add Plan Button */}
        {isTrainerMode && !showAddPlanForm && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowAddPlanForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} className="inline-block mr-2" />
              Add New Workout Plan
            </button>
          </div>
        )}

        {/* Add Plan Form */}
        {isTrainerMode && showAddPlanForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-6 bg-white rounded-xl shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Workout Plan</h3>
            <div className="space-y-4">
              <input
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Plan Name"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Plan Type"
                value={newPlan.type}
                onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
              />
              <textarea
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              />
              <input
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Scheduled Days"
                value={newPlan.days}
                onChange={(e) => setNewPlan({ ...newPlan, days: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCreatePlan}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save size={16} className="inline-block mr-2" />
                  Create
                </button>
                <button
                  onClick={() => setShowAddPlanForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  <XCircle size={16} className="inline-block mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Workout Plans List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans.map((plan) => (
            <motion.div
              key={plan.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                {editingPlan === plan.id ? (
                  // Edit Plan Form
                  <div className="space-y-4">
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Plan Name"
                      value={editedPlanData.name}
                      onChange={(e) => setEditedPlanData({ ...editedPlanData, name: e.target.value })}
                    />
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Plan Type"
                      value={editedPlanData.type}
                      onChange={(e) => setEditedPlanData({ ...editedPlanData, type: e.target.value })}
                    />
                    <textarea
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description"
                      value={editedPlanData.description}
                      onChange={(e) => setEditedPlanData({ ...editedPlanData, description: e.target.value })}
                    />
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Scheduled Days"
                      value={editedPlanData.days}
                      onChange={(e) => setEditedPlanData({ ...editedPlanData, days: e.target.value })}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleSavePlan}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save size={16} className="inline-block mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPlan(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        <XCircle size={16} className="inline-block mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Plan Details
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                      {isTrainerMode && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPlan(plan)}
                            className="p-1 text-gray-500 hover:text-blue-500"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <Dumbbell size={16} className="mr-2" />
                      <span>{plan.type}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar size={16} className="mr-2" />
                      <span>{plan.days}</span>
                    </div>

                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <button
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setShowModal(true);
                        fetchExercisesForPlan(plan.id);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      View Exercises
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for Exercises */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPlan} Exercises</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>
                </div>

                {editingExercises === selectedPlan ? (
                  // Edit Mode
                  <div className="space-y-4">
                    {editedExercisesData.map((exercise, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                      >
                        <div className="flex-1 space-y-2">
                          <input
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={exercise.exercise}
                            onChange={(e) => {
                              const updatedExercises = [...editedExercisesData];
                              updatedExercises[index].exercise = e.target.value;
                              setEditedExercisesData(updatedExercises);
                            }}
                          />
                          <input
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={exercise.sets}
                            onChange={(e) => {
                              const updatedExercises = [...editedExercisesData];
                              updatedExercises[index].sets = e.target.value;
                              setEditedExercisesData(updatedExercises);
                            }}
                          />
                          <input
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={exercise.reps}
                            onChange={(e) => {
                              const updatedExercises = [...editedExercisesData];
                              updatedExercises[index].reps = e.target.value;
                              setEditedExercisesData(updatedExercises);
                            }}
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteExercise(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddExercise}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} className="inline-block mr-2" />
                      Add Exercise
                    </button>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={handleSaveExercises}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save size={16} className="inline-block mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingExercises(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        <XCircle size={16} className="inline-block mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    {detailedExercises[selectedPlan]?.map((exercise, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-800">{exercise.exercise}</h4>
                          <div className="text-gray-600 text-sm">
                            {exercise.sets} • {exercise.reps}
                          </div>
                        </div>
                        {isTrainerMode && (
                          <button
                            onClick={() => handleEditExercises(selectedPlan)}
                            className="p-1 text-gray-500 hover:text-blue-500"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutPlans;