import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const TrAssignedMember = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMembers, setTotalMembers] = useState(0);
    const itemsPerPage = 10; // Matches the controller's default limit

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/trainer/get-assigned-members?page=${currentPage}&limit=${itemsPerPage}`,
                    { withCredentials: true }
                );
                setMembers(response.data.assignedMembers);
                setTotalMembers(response.data.total);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching assigned members");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [currentPage]);

    const totalPages = Math.ceil(totalMembers / itemsPerPage);

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Assigned Members</h2>
            <p className="text-gray-600 mb-2">Total Assigned Members: {totalMembers}</p>
            {loading ? (
                <p className="text-gray-500">Loading members...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : members.length > 0 ? (
                <ul>
                    {members.map((member) => (
                        <li
                            key={member._id}
                            className="flex justify-between items-center p-4 mb-4 border-b border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            <div>
                                <p className="font-semibold text-lg text-gray-800">
                                    {member.first_name} {member.last_name}
                                    <span className="text-sm text-gray-500 ml-2">({member.email})</span>
                                </p>
                            </div>
                            <div>
                                <FaCheckCircle className="text-green-500 text-xl" />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No members assigned yet.</p>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <button
                        className={`px-6 py-2 rounded-lg mx-2 transition ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="text-lg text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className={`px-6 py-2 rounded-lg mx-2 transition ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrAssignedMember;
