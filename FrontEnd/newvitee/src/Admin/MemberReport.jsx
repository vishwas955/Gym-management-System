import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const MemberReport = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalMembers, setTotalMembers] = useState(0);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://localhost:4000/auth/User/get-users';

    useEffect(() => {
        fetchMembers();
    }, [page]);

    useEffect(() => {
        filterMembers();
    }, [searchTerm, startDate, endDate, members]);
    
    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_BASE_URL, {
                params: {
                    searchTerm: searchTerm,
                    startDate: startDate ? startDate.toISOString() : null,
                    endDate: endDate ? endDate.toISOString() : null,
                    skip: (page - 1) * perPage,
                    limit: perPage,
                },
                withCredentials: true
            });

            setMembers(response.data);
            setTotalMembers(response.data.length);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterMembers = () => {
        let filtered = members;

        if (searchTerm) {
            filtered = filtered.filter(member =>
                `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (startDate && endDate) {
            filtered = filtered.filter(member => {
                const joiningDate = new Date(member.createdAt);
                return joiningDate >= new Date(startDate) && joiningDate <= new Date(endDate);
            });
        }

        setFilteredMembers(filtered);
    };

    const generatePDFReport = () => {
        if (!filteredMembers || filteredMembers.length === 0) {
            alert("No members available to generate report!");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Member Report", 14, 16);

        const tableColumn = ["ID","Name","Email", "Join Date", "Membership Status"];
        const tableRows = filteredMembers.map(member => [
            member._id,
            `${member.first_name} ${member.last_name}`,
            member.gym_member_id?.email || "N/A",
            new Date(member.createdAt).toLocaleDateString(),
            member.membershipStatus || "No Membership"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 50 }, 2: { cellWidth: 40 }, 3: { cellWidth: 40 } }
        });

        doc.save("member_report.pdf");
    };

    const generateExcelReport = () => {
        if (!filteredMembers || filteredMembers.length === 0) {
            alert("No members available to generate report!");
            return;
        }

        const data = filteredMembers.map(member => ({
            ID: member._id,
            Name: `${member.first_name} ${member.last_name}`,
            Email: member.gym_member_id?.email,
            JoinDate: new Date(member.createdAt).toLocaleDateString(),
            MembershipStatus: member.membershipStatus || "No Membership"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
        XLSX.writeFile(workbook, "member_report.xlsx");
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Member Report</h1>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-1/3"
                />
                <div className="flex items-center gap-4">
                    <DatePicker selected={startDate} onChange={setStartDate} className="border p-2 rounded" placeholderText="Start Date" />
                    <DatePicker selected={endDate} onChange={setEndDate} className="border p-2 rounded" placeholderText="End Date" />
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg mt-6">
                <table className="w-full table-auto">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Join Date</th>
                            <th className="py-3 px-4">Membership Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                        ) : filteredMembers.length > 0 ? (
                            filteredMembers.map(member => (
                                <tr key={member._id} className="border-b">
                                    <td className="py-3 px-4 text-center">{member.first_name} {member.last_name}</td>
                                    <td className="py-3 px-4">{member.email}</td>
                                    <td className="py-3 px-4 text-center">{new Date(member.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-center">{member.membershipStatus || "No Membership"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center py-4">No members found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button onClick={generatePDFReport} className="bg-blue-500 text-white py-2 px-4 rounded">Download PDF Report</button>
                <button onClick={generateExcelReport} className="bg-green-500 text-white py-2 px-4 rounded">Download Excel Report</button>
            </div>
        </div>
    );
};

export default MemberReport;
