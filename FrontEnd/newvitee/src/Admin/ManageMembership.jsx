import React, { useState } from "react";
import { motion } from "framer-motion";

const ManageMembership = () => {
  const [memberships, setMemberships] = useState([
    { id: 1, user: "John Doe", plan: "Standard", startDate: "2023-01-15", endDate: "2023-02-15" },
    { id: 2, user: "Jane Smith", plan: "Premium", startDate: "2023-01-20", endDate: "2023-02-20" },
    { id: 3, user: "Michael Lee", plan: "Standard", startDate: "2023-02-10", endDate: "2023-03-10" },
    { id: 4, user: "Sara Connor", plan: "Premium", startDate: "2023-02-15", endDate: "2023-03-15" },
    // Add more sample data as needed
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMemberships, setFilteredMemberships] = useState(memberships);
  const [page, setPage] = useState(1);
  const [newMembership, setNewMembership] = useState({
    id: "",
    user: "",
    plan: "",
    startDate: "",
    endDate: ""
  });
  const [editMembership, setEditMembership] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [membershipToDelete, setMembershipToDelete] = useState(null);
  const perPage = 5;

  const filterMemberships = () => {
    const results = memberships.filter(membership =>
      membership.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membership.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMemberships(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredMemberships.length / perPage);
  const currentMemberships = filteredMemberships.slice((page - 1) * perPage, page * perPage);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Add new membership
  const handleAddMembership = () => {
    const newId = memberships.length ? Math.max(...memberships.map(m => m.id)) + 1 : 1;
    const newMember = { ...newMembership, id: newId };
    setMemberships([...memberships, newMember]);
    setNewMembership({ id: "", user: "", plan: "", startDate: "", endDate: "" }); // Reset form
  };

  // Edit membership
  const handleEditMembership = (membership) => {
    setEditMembership(membership);
    setNewMembership({
      id: membership.id,
      user: membership.user,
      plan: membership.plan,
      startDate: membership.startDate,
      endDate: membership.endDate,
    });
  };

  // Update membership
  const handleUpdateMembership = () => {
    const updatedMemberships = memberships.map((membership) =>
      membership.id === newMembership.id ? newMembership : membership
    );
    setMemberships(updatedMemberships);
    setEditMembership(null);  // Close edit form
    setNewMembership({ id: "", user: "", plan: "", startDate: "", endDate: "" }); // Reset form
  };

  // Delete membership
  const handleDeleteMembership = () => {
    const updatedMemberships = memberships.filter((membership) => membership.id !== membershipToDelete.id);
    setMemberships(updatedMemberships);
    setDeleteConfirm(false);
    setMembershipToDelete(null);  // Reset delete confirmation
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Membership</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          className="border px-4 py-2 rounded w-full sm:w-1/2 mb-4"
          placeholder="Search by member name or plan"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            filterMemberships();
          }}
        />
      </div>

      {/* Membership Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full table-auto">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Start Date</th>
              <th className="py-3 px-4">End Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMemberships.map((membership) => (
              <motion.tr
                key={membership.id}
                className="border-b"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <td className="py-3 px-4 text-center">{membership.id}</td>
                <td className="py-3 px-4 text-center">{membership.user}</td>
                <td className="py-3 px-4 text-center">{membership.plan}</td>
                <td className="py-3 px-4 text-center">{membership.startDate}</td>
                <td className="py-3 px-4 text-center">{membership.endDate}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                    onClick={() => handleEditMembership(membership)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded"
                    onClick={() => {
                      setDeleteConfirm(true);
                      setMembershipToDelete(membership);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevPage}
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="py-2 px-4 text-lg">Page {page} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add or Edit Membership Form */}
      <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{editMembership ? "Edit Membership" : "Add New Membership"}</h2>
        <div className="mb-4">
          <label className="block text-gray-700">User Name</label>
          <input
            type="text"
            className="border px-4 py-2 w-full rounded"
            value={newMembership.user}
            onChange={(e) => setNewMembership({ ...newMembership, user: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Plan</label>
          <input
            type="text"
            className="border px-4 py-2 w-full rounded"
            value={newMembership.plan}
            onChange={(e) => setNewMembership({ ...newMembership, plan: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            className="border px-4 py-2 w-full rounded"
            value={newMembership.startDate}
            onChange={(e) => setNewMembership({ ...newMembership, startDate: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            className="border px-4 py-2 w-full rounded"
            value={newMembership.endDate}
            onChange={(e) => setNewMembership({ ...newMembership, endDate: e.target.value })}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded"
            onClick={editMembership ? handleUpdateMembership : handleAddMembership}
          >
            {editMembership ? "Update Membership" : "Add Membership"}
          </button>
          {editMembership && (
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded"
              onClick={() => setEditMembership(null)}  // Cancel editing
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this membership?</h2>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={handleDeleteMembership}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembership;
