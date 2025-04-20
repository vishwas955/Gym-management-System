import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const MemberReport = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalMembers, setTotalMembers] = useState(0);
    const [role, setrole] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
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

            const role = await axios.get("http://localhost:4000/auth/User/token-verification",{
                withCredentials : true
            });
            
            setrole(role); 

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

    // Consistent header (60px tall) with logo, company name, report title, generated date and user role.
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
    doc.text("Member Report", 50, 35);
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

        if (!filteredMembers || filteredMembers.length === 0) {
            alert("No members available to generate report!");
            return;
        }
        
        renderHeader(doc, pageWidth, margin);
        renderFooter(doc, pageWidth, pageHeight, margin, currentPage)
        
        // Date range if selected
        if (startDate && endDate) {
            doc.setFontSize(12);
            doc.text(
                `Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
                105,
                60,
                { align: 'center' }
            );
        }

        // Table data
        const tableColumn = ["ID", "Name", "Email", "Join Date", "Membership Status"];
        const tableRows = filteredMembers.map(member => [
            member._id,
            `${member.first_name} ${member.last_name}`,
            member.email || "N/A",
            new Date(member.createdAt).toLocaleDateString(),
            member.membershipStatus || "No Membership"
        ]);

        // Generate table
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
                0: { cellWidth: 30 }, 
                1: { cellWidth: 40 }, 
                2: { cellWidth: 50 },
                3: { cellWidth: 30 },
                4: { cellWidth: 40 }
            }
        });

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

        doc.save("caliber_fitness_member_report.pdf");
    };

    const generateExcelReport = () => {
        if (!filteredMembers || filteredMembers.length === 0) {
            alert("No members available to generate report!");
            return;
        }

        const data = filteredMembers.map(member => ({
            ID: member._id,
            Name: `${member.first_name} ${member.last_name}`,
            Email: member.email,
            'Join Date': new Date(member.createdAt).toLocaleDateString(),
            'Membership Status': member.membershipStatus || "No Membership"
        }));

        // Add header row with styling
        const worksheet = XLSX.utils.json_to_sheet(data, {
            header: ["ID", "Name", "Email", "Join Date", "Membership Status"]
        });
        
        // Create workbook and add worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
        
        // Add company name to first row
        if (!workbook.Props) workbook.Props = {};
        workbook.Props.Title = "CALIBER FITNESS - Member Report";
        
        XLSX.writeFile(workbook, "caliber_fitness_member_report.xlsx");
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Member Report</h1>
                
                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                        <DatePicker 
                            selected={startDate} 
                            onChange={setStartDate} 
                            className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholderText="Start Date" 
                        />
                        <DatePicker 
                            selected={endDate} 
                            onChange={setEndDate} 
                            className="border border-gray-300 p-2 rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholderText="End Date" 
                        />
                    </div>
                </div>

                {/* Members Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                    <table className="w-full table-auto">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Email</th>
                                <th className="py-3 px-4 text-left">Join Date</th>
                                <th className="py-3 px-4 text-left">Membership Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMembers.length > 0 ? (
                                filteredMembers.map(member => (
                                    <tr key={member._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{member.first_name} {member.last_name}</td>
                                        <td className="py-3 px-4">{member.email}</td>
                                        <td className="py-3 px-4">{new Date(member.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                member.membershipStatus === "Active" 
                                                    ? "bg-green-100 text-green-800" 
                                                    : "bg-gray-100 text-gray-800"
                                            }`}>
                                                {member.membershipStatus || "No Membership"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">
                                        No members found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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

export default MemberReport;