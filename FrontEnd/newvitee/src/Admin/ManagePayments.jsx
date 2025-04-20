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
    const [perPage] = useState(10);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(true);
        const [role, setrole] = useState('');
    

    useEffect(() => {
        fetchPayments();
    }, [page]);

    useEffect(() => {
        filterPayments();
    }, [searchQuery, startDate, endDate, payments]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
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
            const role = await axios.get("http://localhost:4000/auth/User/token-verification",{
                            withCredentials : true
                        });
                        
                        setrole(role);
            setPayments(response.data.payments);
            setFilteredPayments(response.data.payments);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
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
        setPage(1);
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

    const renderHeader = (doc, pageWidth, margin) => {
        doc.setFillColor(102, 51, 153);
        doc.rect(0, 0, pageWidth, 60, "F");
        // Company Logo
        doc.addImage("/images/Caliber_Logo.jpg", "JPEG", 10, 15, 30, 30);
        // Company Name and Report Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text("Caliber Fitness", 50, 25);
        doc.setFontSize(14);
        doc.text("Payment Report", 50, 35);
        // Right-aligned generated date and role
        doc.setFontSize(10);
        const currentDate = new Date().toLocaleString();
        doc.text(`Generated on: ${currentDate}`, pageWidth - margin, 25, {
          align: "right",
        });
        if (role) {
          doc.text(`Role: Admin`, pageWidth - margin, 35, {
            align: "right",
          });
        }
      };
    
      // Consistent footer showing downloader's details and page number.
      const renderFooter = (doc, pageWidth, pageHeight, margin, currentPage) => {
        const footerY = pageHeight - 10;
        doc.setFontSize(8);
        doc.setTextColor(100);
        const downloadName = "Admin" || "";
        const downloadEmail = "admin@gmail.com" || "";
        doc.text(`Downloaded by: ${downloadName} (${downloadEmail})`, margin, footerY);
        doc.text(`Page ${currentPage}`, pageWidth - margin - 20, footerY);
      };
    

    const generatePDFReport = () => {
        const doc = new jsPDF();
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 14;
                let currentPage = 1;


        if (!filteredPayments.length) {
            alert("No payments available to generate report!");
            return;
        }

        renderHeader(doc, pageWidth, margin);
        renderFooter(doc, pageWidth, pageHeight, margin, currentPage)
        
        // Add date range if selected
        if (startDate && endDate) {
            doc.setFontSize(12);
            doc.text(
                `Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
                105,
                60,
                { align: 'center' }
            );
        }

        const tableColumn = ["Member", "Email", "Amount", "Date", "Method", "Status"];
        const tableRows = filteredPayments.map(payment => [
            `${payment.gym_member_id?.first_name || ''} ${payment.gym_member_id?.last_name || ''}`,
            payment.gym_member_id?.email || "N/A",
            `Rs.${payment.amount || "0"}`,
            payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A",
            payment.method || "N/A",
            payment.status || "N/A"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: startDate && endDate ? 75 : 65,
            styles: { 
                fontSize: 10, 
                cellPadding: 3,
                halign: 'center'
            },
            headStyles: {
                fillColor: [33, 150, 243],
                textColor: 255,
                fontStyle: 'bold'
            },
            columnStyles: { 
                0: { cellWidth: 35 }, 
                1: { cellWidth: 40 }, 
                2: { cellWidth: 20 },
                3: { cellWidth: 25 },
                4: { cellWidth: 25 },
                5: { cellWidth: 20 }
            }
        });

        // Add total revenue
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
            `Total Revenue: Rs.${calculateTotalRevenue()}`,
            14,
            doc.lastAutoTable.finalY + 10
        );

        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() - 20,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        doc.save("caliber_fitness_payments_report.pdf");
    };

    const generateExcelReport = () => {
        if (!filteredPayments.length) {
            alert("No payments available to generate report!");
            return;
        }

        const data = filteredPayments.map(payment => ({
            Member: `${payment.gym_member_id?.first_name || ''} ${payment.gym_member_id?.last_name || ''}`,
            Email: payment.gym_member_id?.email || "N/A",
            Amount: `Rs.${payment.amount || "0"}`,
            Date: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A",
            Method: payment.method || "N/A",
            Status: payment.status || "N/A"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
        
        // Add company name to workbook properties
        if (!workbook.Props) workbook.Props = {};
        workbook.Props.Title = "CALIBER FITNESS - Payments Report";
        
        // Add total revenue
        XLSX.utils.sheet_add_aoa(worksheet, [
            [null, null, null, null, null, null, `Total Revenue: Rs.${calculateTotalRevenue()}`]
        ], { origin: -1 });
        
        XLSX.writeFile(workbook, "caliber_fitness_payments_report.xlsx");
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Payments Report</h1>
                
                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search by member, method or status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                        <DatePicker 
                            selected={startDate} 
                            onChange={setStartDate} 
                            className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholderText="Start Date" 
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                        />
                        <DatePicker 
                            selected={endDate} 
                            onChange={setEndDate} 
                            className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholderText="End Date" 
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                        />
                    </div>
                </div>

                {/* Revenue Summary */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">Total Revenue:</div>
                        <div className="text-2xl font-bold text-green-600">Rs.{calculateTotalRevenue()}</div>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                    <table className="w-full table-auto">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Member</th>
                                <th className="py-3 px-4 text-left">Email</th>
                                <th className="py-3 px-4 text-left">Amount</th>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Method</th>
                                <th className="py-3 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPayments.length > 0 ? (
                                filteredPayments.map(payment => (
                                    <tr key={payment._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{payment.gym_member_id?.first_name} {payment.gym_member_id?.last_name}</td>
                                        <td className="py-3 px-4">{payment.gym_member_id?.email}</td>
                                        <td className="py-3 px-4 font-medium">Rs.{payment.amount}</td>
                                        <td className="py-3 px-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <span className="capitalize">{payment.method}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                payment.status === "completed" 
                                                    ? "bg-green-100 text-green-800" 
                                                    : payment.status === "failed"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        No payments found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={handlePrevPage}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        disabled={page === 1}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </button>
                    <span className="text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        disabled={page === totalPages}
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Report Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                    <button 
                        onClick={generatePDFReport} 
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Download PDF Report
                    </button>
                    <button 
                        onClick={generateExcelReport} 
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Excel Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagePayments;