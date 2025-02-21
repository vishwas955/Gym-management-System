// ManagePayments.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ManagePayments = () => {
    const [payments, setPayments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(5);

    // Fetch payments from the backend with pagination and search
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:4000/payment/get-payment', {
                    params: {
                        page,
                        limit: perPage,
                        search: searchQuery
                    },
                    withCredentials: true // Allow cookies to be sent with the request
                });
                setPayments(response.data.payments);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching payments:", error);
            }
        };
        fetchPayments();
    }, [page, perPage, searchQuery]);

    // Handle Pagination
    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Payments</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    className="border px-4 py-2 rounded w-full sm:w-1/2 mb-4"
                    placeholder="Search by payment method or status"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1); // Reset to first page on search
                    }}
                />
            </div>

            {/* Payment Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="w-full table-auto">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="py-3 px-4">ID</th>
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Method</th>
                            <th className="py-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id} className="border-b">
                                <td className="py-3 px-4">{payment.transaction_id}</td>
                                <td className="py-3 px-4">{payment.gym_member_id?.first_name} {payment.gym_member_id?.last_name}</td>
                                <td className="py-3 px-4">{payment.gym_member_id?.email}</td>
                                <td className="py-3 px-4">Rs.{payment.amount}</td>
                                <td className="py-3 px-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-4">{payment.method}</td>
                                <td className="py-3 px-4">{payment.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={handlePrevPage}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={page === 1}
                >
                    Prev
                </button>
                <span className="py-2 px-4 text-lg">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManagePayments;
