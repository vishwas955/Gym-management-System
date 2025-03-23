import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ManageMemberships = () => {
    const [memberships, setMemberships] = useState([]);
    const [filteredMemberships, setFilteredMemberships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalMemberships, setTotalMemberships] = useState(0);

    const API_BASE_URL = 'http://localhost:4000/membership';

    useEffect(() => {
        fetchMemberships();
    }, []);

    useEffect(() => {
        filterMemberships();
    }, [searchTerm, startDate, endDate, memberships]);

    const fetchMemberships = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/get-membership`, {
                params: {
                    skip: (page - 1) * perPage,
                    limit: perPage,
                },
                withCredentials: true,
            });
            setMemberships(response.data.memberships);
            setFilteredMemberships(response.data.memberships); // Initial filter
            setTotalMemberships(response.data.total);
        } catch (error) {
            console.error('Error fetching memberships:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterMemberships = () => {
        let filtered = memberships;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(membership =>
                `${membership.gymMemberId?.first_name || ''} ${membership.gymMemberId?.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (startDate && endDate) {
            filtered = filtered.filter(membership => {
                const joiningDate = new Date(membership.startDate); // Assuming startDate is the date to filter
                return joiningDate >= new Date(startDate) && joiningDate <= new Date(endDate);
            });
        }

        setFilteredMemberships(filtered);
        setPage(1); // Reset page number after filtering
    };

    const generatePDFReport = () => {
        if (!filteredMemberships.length) {
            alert("No memberships available in the selected range!");
            return;
        }

        const doc = new jsPDF();
        doc.text("Membership Report", 14, 16);

        // Add date range to the PDF
        if (startDate && endDate) {
            doc.text(`From: ${startDate.toLocaleDateString()} To: ${endDate.toLocaleDateString()}`, 10, 20);
        }

        // Prepare data for PDF table
        const data = filteredMemberships.map(membership => [
            `${membership.gymMemberId?.first_name || ''} ${membership.gymMemberId?.last_name || ''}`,
            membership.subscriptionId?.name || 'N/A',
            membership.startDate ? new Date(membership.startDate).toLocaleDateString() : 'N/A',
            membership.endDate ? new Date(membership.endDate).toLocaleDateString() : 'N/A',
        ]);

        // Define table headers
        const headers = [['Gym Member', 'Subscription', 'Start Date', 'End Date']];

        // Add table to PDF
        autoTable(doc, {
            head: headers,
            body: data,
            startY: 30,
            styles: { fontSize: 10 },
        });

        doc.save("membership_report.pdf");
    };

    const generateExcelReport = () => {
        if (!filteredMemberships.length) {
            alert("No memberships available in the selected range!");
            return;
        }

        const data = filteredMemberships.map(membership => ({
           
            GymMember: `${membership.gymMemberId?.first_name || ''} ${membership.gymMemberId?.last_name || ''}`,
            Subscription: membership.subscriptionId?.name || 'N/A',
            StartDate: membership.startDate ? new Date(membership.startDate).toLocaleDateString() : 'N/A',
            EndDate: membership.endDate ? new Date(membership.endDate).toLocaleDateString() : 'N/A',
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Memberships");

        XLSX.writeFile(workbook, "membership_report.xlsx");
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Manage Memberships</h1>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by member name..."
                    className="w-full border rounded px-4 py-2"
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1); // Reset to first page on search
                    }}
                />
            </div>

            {/* Date Range Picker */}
            <div className="mt-6 flex gap-4">
                <div>
                    <label className="block text-gray-700 mb-2">Start Date:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="border px-4 py-2 rounded w-full"
                        placeholderText="Select start date"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">End Date:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="border px-4 py-2 rounded w-full"
                        placeholderText="Select end date"
                    />
                </div>
            </div>

            {/* Membership Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg mt-6">
                <table className="w-full table-auto">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="py-3 px-4">Gym Member</th>
                            <th className="py-3 px-4">Subscription</th>
                            <th className="py-3 px-4">Start Date</th>
                            <th className="py-3 px-4">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMemberships.length > 0 ? (
                            filteredMemberships.map((membership) => (
                                <tr key={membership._id} className="border-b">
                                    <td className="py-3 px-4 text-center">{`${membership.gymMemberId?.first_name} ${membership.gymMemberId?.last_name}`}</td>
                                    <td className="py-3 px-4 text-center">{membership.subscriptionId?.name}</td>
                                    <td className="py-3 px-4 text-center">{membership.startDate ? new Date(membership.startDate).toLocaleDateString() : "N/A"}</td>
                                    <td className="py-3 px-4 text-center">{membership.endDate ? new Date(membership.endDate).toLocaleDateString() : "N/A"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">No memberships found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Download Buttons */}
            <div className="mt-6 flex justify-end gap-4">
                <button onClick={generatePDFReport} className="bg-blue-500 text-white py-2 px-4 rounded">
                    Download PDF Report
                </button>
                <button onClick={generateExcelReport} className="bg-blue-500 text-white py-2 px-4 rounded">
                    Download Excel Report
                </button>
            </div>
        </div>
    );
};

export default ManageMemberships;
