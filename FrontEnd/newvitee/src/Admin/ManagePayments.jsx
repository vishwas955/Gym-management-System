import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ManagePayments = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(5);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        filterPayments();
    }, [searchQuery, startDate, endDate, payments]);

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
                withCredentials: true
            });
            setPayments(response.data.payments);
            setFilteredPayments(response.data.payments);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const filterPayments = () => {
        let filtered = payments;

        if (searchQuery) {
            filtered = filtered.filter(payment =>
                payment.method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payment.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                `${payment.gym_member_id?.first_name} ${payment.gym_member_id?.last_name}`?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (startDate && endDate) {
            filtered = filtered.filter(payment => {
                const paymentDate = new Date(payment.createdAt);
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                return paymentDate >= start && paymentDate <= end;
            });
        }

        setFilteredPayments(filtered);
        setPage(1); // Reset page number after filtering
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const calculateTotalRevenue = () => {
        if (!filteredPayments) return 0;
        return filteredPayments.reduce((total, payment) => total + payment.amount, 0).toFixed(2);
    };

    const generatePDFReport = () => {
        if (!filteredPayments.length) {
            alert("No payments available in the selected range!");
            return;
        }

        const doc = new jsPDF();
        doc.text("Payments Report", 10, 10);

        const tableColumn = ['ID', 'User', 'Email', 'Amount', 'Date', 'Method', 'Status'];
        const tableRows = filteredPayments.map(payment => [
            `${payment.gym_member_id?.first_name || "N/A"} ${payment.gym_member_id?.last_name || "N/A"}`,
            payment.gym_member_id?.email || "N/A",
            `Rs.${payment.amount || "0"}`,
            payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A",
            payment.method || "N/A",
            payment.status || "N/A",
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 35 }, 2: { cellWidth: 40 }, 3: { cellWidth: 20 }, 4: { cellWidth: 25 } },
        });

        doc.text(`Total Revenue: Rs.${calculateTotalRevenue()}`, 10, doc.lastAutoTable.finalY + 10);
        doc.save("payments_report.pdf");
    };

    const generateExcelReport = () => {
        const data = filteredPayments.map(payment => ({
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
        XLSX.utils.sheet_add_aoa(worksheet, [[null, null, null, null, null, null, `Total Revenue: Rs.${calculateTotalRevenue()}`]], { origin: -1 });
        XLSX.writeFile(workbook, "payments_report.xlsx");
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Payments</h1>
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

            <div className="mb-6">
                <input
                    type="text"
                    className="border px-4 py-2 rounded w-full sm:w-1/2 mb-4"
                    placeholder="Search by payment method or status"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="w-full table-auto">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Method</th>
                            <th className="py-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((payment) => (
                            <tr key={payment._id} className="border-b">
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

            <div className="mt-6 flex justify-end gap-4">
                <button onClick={generatePDFReport} className="bg-blue-500 text-white py-2 px-4 rounded">
                    Generate PDF Report
                </button>
                <button onClick={generateExcelReport} className="bg-blue-500 text-white py-2 px-4 rounded">
                    Generate Excel Report
                </button>
            </div>
        </div>
    );
};

export default ManagePayments;
