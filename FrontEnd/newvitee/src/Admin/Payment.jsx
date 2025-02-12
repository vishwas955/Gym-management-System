import React, { useState, useEffect } from "react";
import axios from "axios";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);  // Number of items per page

  // Fetch payments from the backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/payments")
      .then((response) => {
        setPayments(response.data);
        setFilteredPayments(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the payments data:", error);
      });
  }, []);

  // Filter payments based on search query (by user or plan)
  useEffect(() => {
    const results = payments.filter(payment => 
      payment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPayments(results);
    setPage(1);  // Reset to first page when search is changed
  }, [searchQuery, payments]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPayments.length / perPage);
  const currentPayments = filteredPayments.slice((page - 1) * perPage, page * perPage);

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
          placeholder="Search by member name or plan"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Payment Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full table-auto">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Plan</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment) => (
              <tr key={payment.id} className="border-b">
                <td className="py-3 px-4">{payment.id}</td>
                <td className="py-3 px-4">{payment.user}</td>
                <td className="py-3 px-4">${payment.amount}</td>
                <td className="py-3 px-4">{payment.date}</td>
                <td className="py-3 px-4">{payment.plan}</td>
              </tr>
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
    </div>
  );
};

export default ManagePayments;
