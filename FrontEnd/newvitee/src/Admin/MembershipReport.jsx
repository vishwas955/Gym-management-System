import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ManageMemberships = () => {
    const [memberships, setMemberships] = useState([]);
    const [users, setUsers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalMemberships, setTotalMemberships] = useState(0);

    const API_BASE_URL = 'http://localhost:4000/membership';

    useEffect(() => {
        fetchMemberships();
        fetchUsers();
        fetchSubscriptions();
    }, [startDate, endDate, page, perPage, searchTerm]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:4000/auth/User/get-users", { withCredentials: true });
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users.');
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get("http://localhost:4000/subscription/get-subscription", { withCredentials: true });
            setSubscriptions(response.data);
        } catch (error) {
            toast.error('Failed to fetch subscriptions.');
        }
    };

    const fetchMemberships = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/get-membership`, {
                params: {
                    skip: (page - 1) * perPage,
                    limit: perPage,
                    startDate: startDate ? startDate.toISOString() : null,
                    endDate: endDate ? endDate.toISOString() : null,
                    searchTerm,
                },
                withCredentials: true,
            });

            setMemberships(response.data.memberships);
            setTotalMemberships(response.data.total);
        } catch (error) {
            toast.error('Failed to fetch memberships.');
        } finally {
            setLoading(false);
        }
    };

    // Function to format date as dd-mm-yyyy
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const generatePDFReport = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Membership Report", 14, 16);

            const headers = [['ID', 'Gym Member', 'Subscription', 'Start Date', 'End Date']];
            const data = memberships.map(membership => [
                membership._id,
                `${membership.gymMemberId?.first_name || ''} ${membership.gymMemberId?.last_name || ''}`,
                membership.subscriptionId?.name || 'N/A',
                formatDate(membership.startDate),
                formatDate(membership.endDate),
            ]);

            autoTable(doc, {
                startY: 20,
                head: [headers],
                body: data,
                styles: { fontSize: 10 },
                columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 50 }, 2: { cellWidth: 60 }, 3: { cellWidth: 40 },4: {cellwidth: 40} },
            });

            doc.save("membership_report.pdf");
            toast.success('PDF downloaded successfully!');
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error('Failed to download PDF.');
        }
    };
    
    const generateExcelReport = () => {
        const data = memberships.map(membership => ({
            ID: membership._id,
            GymMember: `${membership.gymMemberId?.first_name || ''} ${membership.gymMemberId?.last_name || ''}`,
            Subscription: membership.subscriptionId?.name || 'N/A',
            StartDate: formatDate(membership.startDate),
            EndDate: formatDate(membership.endDate),
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Memberships");
        XLSX.writeFile(workbook, "membership_report.xlsx");
        toast.success('Excel report generated!');
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Membership Report</h1>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by member name or ID..."
                    className="w-full border rounded px-4 py-2"
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
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
                            <th className="py-3 px-4">ID</th>
                            <th className="py-3 px-4">Gym Member</th>
                            <th className="py-3 px-4">Subscription</th>
                            <th className="py-3 px-4">Start Date</th>
                            <th className="py-3 px-4">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : (
                            memberships.map((membership) => (
                                <tr key={membership._id} className="border-b">
                                    <td className="py-3 px-4 text-center">{membership._id}</td>
                                    <td className="py-3 px-4 text-center">{`${membership.gymMemberId?.first_name} ${membership.gymMemberId?.last_name}`}</td>
                                    <td className="py-3 px-4 text-center">{membership.subscriptionId?.name}</td>
                                    <td className="py-3 px-4 text-center">{formatDate(membership.startDate)}</td>
                                    <td className="py-3 px-4 text-center">{formatDate(membership.endDate)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Report Generation Buttons */}
            <div className="mt-6 flex justify-end gap-4">
                <button onClick={generatePDFReport} className="bg-red-500 text-white py-2 px-4 rounded">
                    Download PDF
                </button>
                <button onClick={generateExcelReport} className="bg-green-500 text-white py-2 px-4 rounded">
                    Download Excel
                </button>
            </div>
        </div>
    );
};

export default ManageMemberships;
