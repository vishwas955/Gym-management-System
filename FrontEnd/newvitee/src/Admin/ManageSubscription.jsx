import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // Import axios

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ name: "", price: "", details: "", duration: "", _id : "" });
  const [editPlan, setEditPlan] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  const API_BASE_URL = "http://localhost:4000/subscription"; // Or your actual base URL

  useEffect(() => {
    fetchPlans();
  }, []);

  // Fetch plans from the backend
  const fetchPlans = async () => {
    setLoading(true);
    console.log("fetchPlans: Starting to fetch plans..."); //add this
    try {
      const response = await axios.get('http://localhost:4000/subscription/get-subscription',
        {withCredentials : true}
      );
      setPlans(response.data);
    } catch (e) {
      setError(`Failed to fetch plans: ${e.message}`);
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for new plan form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan({ ...newPlan, [name]: value });
  };

  // Add a new plan to the backend
  const addPlan = async () => {
    setError("");
    setSuccess("");

    if (!newPlan.name.trim() || !newPlan.price.trim() || !newPlan.details.trim() || !newPlan.duration.trim()) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(newPlan.price) || newPlan.price <= 0 || isNaN(newPlan.duration) || newPlan.duration <= 0) {
      setError("Price and Duration must be valid positive numbers.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/add-subscription`, newPlan,{ withCredentials : true });
      setPlans([...plans, response.data]); // Update local state with the new plan
      setNewPlan({ name: "", price: "", details: "", duration: "" });
      setSuccess("New plan added successfully!");
    } catch (e) {
      setError(`Failed to add plan: ${e.message}`);
      console.error("Add plan error:", e);
    }
  };

  // Open edit modal with the selected plan
  const startEdit = (plan) => {
    setEditPlan({ ...plan });
  };

  // Update the plan on the backend
  const updatePlan = async () => {
    setError("");
    setSuccess("");

    if (!editPlan.name || !editPlan.price || !editPlan.details || !editPlan.duration) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/update-subscription/${editPlan._id}`, editPlan,{ withCredentials : true });
      setPlans(plans.map((plan) => (plan._id === editPlan._id ? editPlan : plan)));
      setEditPlan(null);
      setSuccess("Plan updated successfully!");
    } catch (e) {
      setError(`Failed to update plan: ${e.message}`);
      console.error("Update plan error:", e);
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (id) => {
    setDeletePlanId(id);
  };

  // Delete a plan from the backend
  const deletePlan = async () => {
    setError("");
    setSuccess("");

    try {
      await axios.delete(`${API_BASE_URL}/delete-subscription/${deletePlanId}`,{ withCredentials : true });
      setPlans(plans.filter((plan) => plan._id !== deletePlanId));
      setDeletePlanId(null);
      setSuccess("Plan deleted successfully!");
    } catch (e) {
      setError(`Failed to delete plan: ${e.message}`);
      console.error("Delete plan error:", e);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Gym Subscriptions</h1>

      {error && <p className="bg-red-100 text-red-600 p-3 rounded-md mb-4">{error}</p>}
      {success && <p className="bg-green-100 text-green-600 p-3 rounded-md mb-4">{success}</p>}

      {loading && <p className="text-gray-500">Loading plans...</p>}

      {/* Existing Plans */}
      <motion.div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Existing Plans</h2>
        {!loading && plans.length === 0 ? (
          <p className="text-gray-500">No plans available.</p>
        ) : (
          plans.map((plan) => (
            <div key={plan._id} className="p-4 border-b hover:bg-gray-100 transition rounded-lg">
              <p className="text-lg font-medium">{plan.name} ({plan.duration} duration)</p>
              <p className="text-gray-600">{plan.details}</p>
              <p className="text-gray-800 font-bold">Rs.{plan.price}</p>
              <div className="flex gap-3 mt-2">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition" onClick={() => startEdit(plan)}>Edit</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={() => confirmDelete(plan._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* Add New Plan */}
      <motion.div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Plan</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Plan Name" className="border px-4 py-2 rounded" value={newPlan.name} onChange={handleInputChange} />
          <input type="number" name="price" placeholder="Plan Price" className="border px-4 py-2 rounded" value={newPlan.price} onChange={handleInputChange} />
          <input type="text" name="details" placeholder="Plan details" className="border px-4 py-2 rounded" value={newPlan.details} onChange={handleInputChange} />
          <input type="number" name="duration" placeholder="Duration (duration)" className="border px-4 py-2 rounded" value={newPlan.duration} onChange={handleInputChange} />
        </div>
        <button className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600 transition" onClick={addPlan}>Add Plan</button>
      </motion.div>

      {/* Edit Modal */}
      {editPlan && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Plan</h3>
            <input type="text" className="border px-4 py-2 rounded w-full mb-2" value={editPlan.name} onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })} />
            <input type="text" className="border px-4 py-2 rounded w-full mb-2" value={editPlan.details} onChange={(e) => setEditPlan({ ...editPlan, details: e.target.value })} />
            <input type="number" className="border px-4 py-2 rounded w-full mb-2" value={editPlan.price} onChange={(e) => setEditPlan({ ...editPlan, price: Number(e.target.value) })} />
            <input type="number" className="border px-4 py-2 rounded w-full mb-4" value={editPlan.duration} onChange={(e) => setEditPlan({ ...editPlan, duration: Number(e.target.value) })} />
            <div className="flex gap-3">
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={updatePlan}>Update</button>
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditPlan(null)}>Cancel</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation */}
      {deletePlanId !== null && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this plan?</h3>
            <div className="flex gap-3">
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={deletePlan}>Delete</button>
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setDeletePlanId(null)}>Cancel</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ManagePlans;