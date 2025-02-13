import React, { useState } from "react";
import { motion } from "framer-motion";

const ManagePlans = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: "Standard", price: 3000, description: "Basic gym access", months: 3 },
    { id: 2, name: "Premium", price: 5000, description: "Full gym access + trainer", months: 6 },
  ]);

  const [newPlan, setNewPlan] = useState({ name: "", price: "", description: "", months: "" });
  const [editPlan, setEditPlan] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan({ ...newPlan, [name]: value });
  };

  // Add a new plan
  const addPlan = () => {
    setError("");
    setSuccess("");

    if (!newPlan.name.trim() || !newPlan.price.trim() || !newPlan.description.trim() || !newPlan.months.trim()) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(newPlan.price) || newPlan.price <= 0 || isNaN(newPlan.months) || newPlan.months <= 0) {
      setError("Price and Duration must be valid positive numbers.");
      return;
    }

    const newId = plans.length > 0 ? plans[plans.length - 1].id + 1 : 1;
    setPlans([...plans, { id: newId, ...newPlan, price: Number(newPlan.price), months: Number(newPlan.months) }]);
    setNewPlan({ name: "", price: "", description: "", months: "" });
    setSuccess("New plan added successfully!");
  };

  // Open edit modal with the selected plan
  const startEdit = (plan) => {
    setEditPlan({ ...plan });
  };

  // Update the plan
  const updatePlan = () => {
    if (!editPlan.name || !editPlan.price || !editPlan.description || !editPlan.months) {
      setError("All fields are required.");
      return;
    }

    setPlans(plans.map((plan) => (plan.id === editPlan.id ? editPlan : plan)));
    setEditPlan(null);
    setSuccess("Plan updated successfully!");
  };

  // Open delete confirmation modal
  const confirmDelete = (id) => {
    setDeletePlanId(id);
  };

  // Delete a plan
  const deletePlan = () => {
    setPlans(plans.filter((plan) => plan.id !== deletePlanId));
    setDeletePlanId(null);
    setSuccess("Plan deleted successfully!");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Gym Subscriptions</h1>

      {error && <p className="bg-red-100 text-red-600 p-3 rounded-md mb-4">{error}</p>}
      {success && <p className="bg-green-100 text-green-600 p-3 rounded-md mb-4">{success}</p>}

      {/* Existing Plans */}
      <motion.div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Existing Plans</h2>
        {plans.length === 0 ? (
          <p className="text-gray-500">No plans available.</p>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="p-4 border-b hover:bg-gray-100 transition rounded-lg">
              <p className="text-lg font-medium">{plan.name} ({plan.months} months)</p>
              <p className="text-gray-600">{plan.description}</p>
              <p className="text-gray-800 font-bold">Rs.{plan.price}</p>
              <div className="flex gap-3 mt-2">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition" onClick={() => startEdit(plan)}>Edit</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={() => confirmDelete(plan.id)}>Delete</button>
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
          <input type="text" name="description" placeholder="Plan Description" className="border px-4 py-2 rounded" value={newPlan.description} onChange={handleInputChange} />
          <input type="number" name="months" placeholder="Duration (Months)" className="border px-4 py-2 rounded" value={newPlan.months} onChange={handleInputChange} />
        </div>
        <button className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600 transition" onClick={addPlan}>Add Plan</button>
      </motion.div>

      {/* Edit Modal */}
      {editPlan && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Plan</h3>
            <input type="text" className="border px-4 py-2 rounded w-full mb-2" value={editPlan.name} onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })} />
            <input type="text" className="border px-4 py-2 rounded w-full mb-2" value={editPlan.description} onChange={(e) => setEditPlan({ ...editPlan, description: e.target.value })} />
            <input type="number" className="border px-4 py-2 rounded w-full mb-2" value={editPlan.price} onChange={(e) => setEditPlan({ ...editPlan, price: e.target.value })} />
            <input type="number" className="border px-4 py-2 rounded w-full mb-4" value={editPlan.months} onChange={(e) => setEditPlan({ ...editPlan, months: e.target.value })} />
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

export default ManagePlans;
