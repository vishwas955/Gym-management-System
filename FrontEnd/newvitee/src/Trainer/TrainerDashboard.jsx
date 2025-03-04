import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa"; // Removed FaTimesCircle import
import axios from "axios";

const TrainerDashboard = () => {
    // State for members
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Show 5 members per page
    const [totalMembers, setTotalMembers] = useState(0); // Total number of members

    useEffect(() => {
        // Fetch assigned members from the backend
        const fetchMembers = async () => {
            try {
                // Include pagination parameters in the request
                const response = await axios.get(
                    `http://localhost:4000/trainer/get-assigned-members?page=${currentPage}&limit=${itemsPerPage}`,
                    {
                        withCredentials: true
                    }
                );
                // Axios directly returns the data in response.data
                setMembers(response.data.assignedMembers);
                setTotalMembers(response.data.total); // Set the total number of members
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [currentPage, itemsPerPage]);

    // Calculate total pages based on the total number of members
    const totalPages = Math.ceil(totalMembers / itemsPerPage);

    // Correct the undefined code
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMembers = members ? members.slice(indexOfFirstItem, indexOfLastItem) : [];
    // Calculate the total pages.
    const totalPagesCalculated = Math.ceil((members?.length || 0) / itemsPerPage);

    return (
        <div className="p-6 bg-blue-900 min-h-screen">
            <h1 className="text-4xl text-white font-bold text-center mb-10">Trainer Dashboard</h1>

            {/* Dashboard Summary */}
            <motion.div
                className="grid grid-cols-1 gap-6 mb-8 max-w-4xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-6 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-semibold">Total Members</h2>
                    <p className="text-4xl font-bold">{loading ? "Loading..." : totalMembers}</p>
                </div>
            </motion.div>

            {/* Assigned Members List */}
            <motion.div
                className="bg-white p-6 rounded-lg shadow-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Assigned Members</h2>
                {loading ? (
                    <p className="text-gray-500">Loading members...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : members?.length > 0 ? (
                    <ul>
                        {members.map((member) => (
                            <li
                                key={member._id}
                                className="flex justify-between items-center p-4 mb-4 border-b border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            >
                                <div>
                                    <p className="font-semibold text-lg text-gray-800">
                                        {member.first_name} {member.last_name}
                                        <span className="text-sm text-gray-500 ml-2">({member.email})</span> {/* Display email */}
                                    </p>
                                    <p className="text-sm text-gray-500">{member.status}</p>
                                </div>
                                <div>
                                    {member.status === "Active" && ( // Show only for Active members
                                        <FaCheckCircle className="text-green-500 text-xl" />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No members assigned yet.</p>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                    <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg mx-2 hover:bg-blue-600 transition"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="text-lg text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg mx-2 hover:bg-blue-600 transition"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default TrainerDashboard;
