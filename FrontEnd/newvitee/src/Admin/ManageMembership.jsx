import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [newMembership, setNewMembership] = useState({
    gymMemberId: '',
    subscriptionId: '',
    startDate: '',
  });
  const [editMembership, setEditMembership] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 5;
  const API_BASE_URL = 'http://localhost:4000/membership'; // Replace with your actual API base URL

  useEffect(() => {
    fetchMemberships();
    fetchUsers();
    fetchSubscriptions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/auth/User/get-users",
        { withCredentials : true }
      );
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users.');
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/subscription/get-subscription",
        { withCredentials : true }
      );
      setSubscriptions(response.data);
    } catch (error) {
      setError('Failed to fetch subscriptions.');
    }
  };

  const fetchMemberships = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-membership`, {
        params: {
          skip: (page - 1) * perPage,
          limit: perPage,
        },
        withCredentials: true, // Move it inside this options object
      });
      setMemberships(response.data.memberships);
    } catch (error) {
      setError('Failed to fetch memberships.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMembership = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add-membership`, newMembership, 
        { withCredentials : true }
      );
      setMemberships([...memberships, response.data.membership]);
      setNewMembership({ gymMemberId: '', subscriptionId: '', startDate: '' });
    } catch (error) {
      setError('Failed to create membership.');
    }
  };

  const handleEditMembership = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-membership/${editMembership._id}`,
        newMembership, 
        { withCredentials : true }
      );
      setMemberships(
        memberships.map((membership) =>
          membership._id === editMembership._id ? response.data.membership : membership
        )
      );
      setEditMembership(null);
    } catch (error) {
      setError('Failed to update membership.');
    }
  };

  const handleDeleteMembership = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-membership/${id}`, 
        { withCredentials : true }
      );
      setMemberships(memberships.filter((membership) => membership.id !== id));
    } catch (error) {
      setError('Failed to delete membership.');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchMemberships();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Memberships</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="mb-4">Loading memberships...</div>}

      {/* Add or Edit Membership Form */}
      <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{editMembership ? 'Edit Membership' : 'Add New Membership'}</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Gym Member</label>
          <select
            className="border px-4 py-2 w-full rounded"
            value={newMembership.gymMemberId}
            onChange={(e) =>
              setNewMembership({ ...newMembership, gymMemberId: e.target.value })
            }
          >
            <option value="">Select Gym Member</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Subscription</label>
          <select
            className="border px-4 py-2 w-full rounded"
            value={newMembership.subscriptionId}
            onChange={(e) =>
              setNewMembership({ ...newMembership, subscriptionId: e.target.value })
            }
          >
            <option value="">Select Subscription</option>
            {subscriptions.map((subscription) => (
              <option key={subscription._id} value={subscription._id}>
                {subscription.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            className="border px-4 py-2 w-full rounded"
            value={newMembership.startDate}
            onChange={(e) =>
              setNewMembership({ ...newMembership, startDate: e.target.value })
            }
          />
        </div>
        <button
          onClick={editMembership ? handleEditMembership : handleCreateMembership}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          {editMembership ? 'Update Membership' : 'Add Membership'}
        </button>
      </div>

      {/* Membership Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg mt-6">
        <table className="w-full table-auto">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Gym Member</th>
              <th className="py-3 px-4">Subscription</th>
              <th className="py-3 px-4">Start Date</th>
              <th className="py-3 px-4">End Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => (
              <tr key={membership.id} className="border-b">
                <td className="py-3 px-4 text-center">{membership._id}</td>
                <td className="py-3 px-4 text-center">
                  {membership.gymMemberId.first_name} {membership.gymMemberId.last_name}
                </td>
                <td className="py-3 px-4 text-center">{membership.subscriptionId.name}</td>
                <td className="py-3 px-4 text-center">{membership.startDate}</td>
                <td className="py-3 px-4 text-center">{membership.endDate}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click from triggering delete
                      handleEditMembership(membership);
                    }}
                    className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation
                      handleDeleteMembership(membership._id);
                    }}
                    className="bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="py-2 px-4 text-lg">
          Page {page} of {Math.ceil(memberships.length / perPage)}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={page * perPage >= memberships.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageMemberships;
