import React, { useState, useEffect } from "react";
import axios from "axios";

const UserPaymentHistory = () => {
    const [payments, setPayments] = useState([]); // Initialize as an empty array
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(5);

    // Fetch member payments from the backend with pagination
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:4000/payment/get-user-payment', {
                    params: {
                        page,
                        limit: perPage,
                    },
                    withCredentials: true // Allow cookies to be sent with the request
                });
                setPayments(response.data || []); // Ensure payments is always an array
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                console.error("Error fetching member payments:", error);
                setPayments([]); // Fallback to an empty array on error
            }
        };
        fetchPayments();
    }, [page, perPage]);

    // Handle Pagination
    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Payment History</h1>

            {/* Payment Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="w-full table-auto">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="py-3 px-4">Transaction ID</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Method</th>
                            <th className="py-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr key={payment.transaction_id} className="border-b">
                                    <td className="py-3 px-4">{payment.transaction_id}</td>
                                    <td className="py-3 px-4">Rs.{payment.amount}</td>
                                    <td className="py-3 px-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{payment.method}</td>
                                    <td className="py-3 px-4">{payment.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">
                                    No payments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handlePrevPage}
                        className={`bg-blue-500 text-white py-2 px-4 rounded ${
                            page === 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={page === 1}
                    >
                        Prev
                    </button>
                    <span className="py-2 px-4 text-lg">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        className={`bg-blue-500 text-white py-2 px-4 rounded ${
                            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserPaymentHistory;
