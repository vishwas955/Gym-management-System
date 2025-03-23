import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const TrainerReport = () => {
    const [trainers, setTrainers] = useState([]);
    const [filteredTrainers, setFilteredTrainers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://localhost:4000/trainer/get-trainers';

    useEffect(() => {
        fetchTrainers();
    }, []);

    useEffect(() => {
        filterTrainers();
    }, [searchTerm, startDate, endDate, trainers]);

    const fetchTrainers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_BASE_URL, { withCredentials: true });

            const formattedTrainers = response.data.map(trainer => ({
                ...trainer,
                createdAt: trainer.createdAt ? new Date(trainer.createdAt).toISOString() : null,
            }));

            setTrainers(formattedTrainers);
            setFilteredTrainers(formattedTrainers);
        } catch (error) {
            console.error('Error fetching trainers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTrainers = () => {
        let filtered = trainers;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(trainer =>
                `${trainer.first_name} ${trainer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (startDate && endDate) {
            filtered = filtered.filter(trainer => {
                const joiningDate = new Date(trainer.createdAt);
                return joiningDate >= new Date(startDate) && joiningDate <= new Date(endDate);
            });
        }

        setFilteredTrainers(filtered);
    };

    const generatePDFReport = () => {
        if (!filteredTrainers.length) {
            alert("No trainers available in the selected range!");
            return;
        }

        const doc = new jsPDF();
        doc.text("Trainer Report", 14, 16);

        const tableColumn = ['ID', 'Name', 'Email', 'Date of Joining'];
        const tableRows = filteredTrainers.map(trainer => [
            trainer._id,
            `${trainer.first_name} ${trainer.last_name}`,
            trainer.email,
            trainer.createdAt ? new Date(trainer.createdAt).toLocaleDateString() : "N/A",
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 50 }, 2: { cellWidth: 60 }, 3: { cellWidth: 40 } },
        });

        doc.save('trainer_report.pdf');
    };

    const generateExcelReport = () => {
        if (!filteredTrainers.length) {
            alert("No trainers available in the selected range!");
            return;
        }

        const data = filteredTrainers.map(trainer => ({
            ID: trainer._id,
            Name: `${trainer.first_name} ${trainer.last_name}`,
            Email: trainer.email,
            DateOfJoining: trainer.createdAt ? new Date(trainer.createdAt).toLocaleDateString() : "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Trainers");

        XLSX.writeFile(workbook, "trainer_report.xlsx");
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Trainer Report</h1>

            {/* Search and Date Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Name..."
                    className="border border-gray-300 p-2 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                    type="date"
                    className="border border-gray-300 p-2 rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="border border-gray-300 p-2 rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            {/* Trainer Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="w-full table-auto">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Date of Joining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : filteredTrainers.length > 0 ? (
                            filteredTrainers.map((trainer) => (
                                <tr key={trainer._id} className="border-b">
                                    <td className="py-3 px-4 text-center">{trainer.first_name} {trainer.last_name}</td>
                                    <td className="py-3 px-4 text-center">{trainer.email}</td>
                                    <td className="py-3 px-4 text-center">
                                        {trainer.createdAt ? new Date(trainer.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No trainers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Download Buttons */}
            <div className="mt-6 flex justify-end gap-4">
                <button 
                    onClick={generatePDFReport} 
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Download PDF Report
                </button>
                <button 
                    onClick={generateExcelReport} 
                    className="bg-green-500 text-white py-2 px-4 rounded"
                >
                    Download Excel Report
                </button>
            </div>
        </div>
    );
};

export default TrainerReport;
