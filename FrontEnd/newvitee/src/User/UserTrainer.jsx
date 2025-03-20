import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserTrainer = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedTrainer = async () => {
      try {
        const response = await axios.get("http://localhost:4000/trainer/get-User-trainer", {
          withCredentials: true, // Send cookies for authentication
        });

        if (!response.data || response.data.length === 0) {
          throw new Error("No assigned trainer found.");
        }

        // Extracting trainer details from the response
        const memberData = response.data[0]; // Backend returns an array
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

      <div className="flex items-center space-x-6 mb-6">
        <img 
          src={trainer.imageUrl || "https://via.placeholder.com/150"} 
          alt={trainer.first_name} 
          className="w-32 h-32 rounded-full shadow-lg" 
        />
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{trainer.first_name} {trainer.last_name}</h3>
          <p className="text-lg text-gray-600">Expertise: {trainer.expertise}</p>
          <p className="text-sm text-gray-500">Experience: {trainer.experience} years</p>
          <p className="text-sm text-gray-500">Certifications: {trainer.certifications || "N/A"}</p>
          <p className="text-sm text-gray-500">Contact: {trainer.email}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About {trainer.first_name}</h3>
        <p className="text-gray-600">
          {trainer.bio || "No additional information available."}
        </p>
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
