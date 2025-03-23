import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaStar } from 'react-icons/fa'; // Import icons

const UserTrainer = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedTrainer = async () => {
      try {
        const response = await axios.get("http://localhost:4000/trainer/get-User-trainer", {
          withCredentials: true,
        });

        if (!response.data || !response.data.membersWithTrainers) {
          throw new Error("No assigned trainer found.");
        }

        const memberData = response.data.membersWithTrainers;
        setTrainer(memberData.trainer_id);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to fetch trainer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTrainer();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading Trainer Details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Your Assigned Trainer</h2>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
        <h3 className="text-2xl font-bold text-gray-800">{trainer.first_name} {trainer.last_name}</h3>
        
        <div className="flex items-center space-x-3 mt-2">
          <span className="text-lg text-gray-600 flex items-center">
            <FaStar className="text-yellow-500 mr-1" />
            Expertise: {trainer.expertise}
          </span>
          <span className="text-lg text-gray-600 flex items-center">
            Experience: {trainer.experience} years
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-2">Certifications: {trainer.certifications || "N/A"}</p>

        <div className="mt-4 flex items-center space-x-2">
          <FaEnvelope className="text-blue-600" />
          <a 
            href={`mailto:${trainer.email}`} 
            className="text-blue-600 hover:text-blue-800 transition duration-300"
          >
            {trainer.email}
          </a>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a 
          href={`mailto:${trainer.email}`} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Contact {trainer.first_name}
        </a>
      </div>
    </div>
  );
};

export default UserTrainer;
