import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import styles
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ManagePayments = () => {
    const [payments, setPayments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(5);
    const [startDate, setStartDate] = useState(null); // Start date state
    const [endDate, setEndDate] = useState(null);     // End date state

    // Fetch payments from the backend with pagination and search
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:4000/payment/get-payment', {
                    params: {
                        page,
                        limit: perPage,
                        search: searchQuery,
                        startDate: startDate ? startDate.toISOString() : null,
                        endDate: endDate ? endDate.toISOString() : null,
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
    }, [page, perPage, searchQuery, startDate, endDate]);

    // Handle Pagination
    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    // Calculate total revenue based on payments
    const calculateTotalRevenue = () => {
        return payments.reduce((total, payment) => total + payment.amount, 0);
    };

    // Generate PDF Report
    const generatePDFReport = () => {
        const doc = new jsPDF();
        doc.text("Payments Report", 10, 10);

        // Add date range to the PDF
        if (startDate && endDate) {
            doc.text(`From: ${startDate.toLocaleDateString()} To: ${endDate.toLocaleDateString()}`, 10, 20);
        }

        const data = payments.map(payment => [
            payment.transaction_id,
            `${payment.gym_member_id?.first_name || ''} ${payment.gym_member_id?.last_name || ''}`,
            payment.gym_member_id?.email,
            `Rs.${payment.amount}`,
            new Date(payment.createdAt).toLocaleDateString(),
            payment.method,
            payment.status,
        ]);

        doc.autoTable({
            head: [['ID', 'User', 'Email', 'Amount', 'Date', 'Method', 'Status']],
            body: data,
        });

        doc.text(`Total Revenue: Rs.${calculateTotalRevenue()}`, 10, doc.lastAutoTable.finalY + 10);

        doc.save("payments_report.pdf");
    };

    // Generate Excel Report
    const generateExcelReport = () => {
        const data = payments.map(payment => ({
            ID: payment.transaction_id,
            User: `${payment.gym_member_id?.first_name || ''} ${payment.gym_member_id?.last_name || ''}`,
            Email: payment.gym_member_id?.email,
            Amount: `Rs.${payment.amount}`,
            Date: new Date(payment.createdAt).toLocaleDateString(),
            Method: payment.method,
            Status: payment.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
        
        // Add total revenue at the end of the sheet
        XLSX.utils.sheet_add_aoa(worksheet, [[null, null, null, null, null, null, `Total Revenue: Rs.${calculateTotalRevenue()}`]], { origin: -1 });

        XLSX.writeFile(workbook, "payments_report.xlsx");
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Payments</h1>

            {/* Date Range Picker */}
            <div className="mb-6">
                <label className="block mb-2">Select Date Range:</label>
                <div className="flex gap-4">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="border px-4 py-2 rounded w-full sm:w-1/2"
                        placeholderText="Start Date"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="border px-4 py-2 rounded w-full sm:w-1/2"
                        placeholderText="End Date"
                    />
                </div>
            </div>

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

            {/* Report Generation Buttons */}
            <div className="mt-6 flex justify-end gap-4">
                <button onClick={generatePDFReport} className="bg-red-500 text-white py-2 px-4 rounded">
                    Generate PDF Report
                </button>
                <button onClick={generateExcelReport} className="bg-green-500 text-white py-2 px-4 rounded">
                    Generate Excel Report
                </button>
            </div>

        </div>
    );
};

export default ManagePayments;
