import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AssignTrainer = () => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch Members
  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/User/get-users", { withCredentials: true })
      .then((response) => setMembers(response.data))
      .catch((error) => console.error("Error fetching members:", error));
  }, []);

  // Fetch Trainers
  useEffect(() => {
    axios
      .get("http://localhost:4000/trainer/get-trainers", { withCredentials: true })
      .then((response) => setTrainers(response.data))
      .catch((error) => console.error("Error fetching trainers:", error));
  }, []);

  // Assign Trainer
  const handleAssignTrainer = () => {
    if (!selectedMember || !selectedTrainer) return;
    axios
      .put(
        `http://localhost:4000/trainer/assign-trainer/${selectedMember._id}`,
        { trainerId: selectedTrainer._id },
        { withCredentials: true }
      )
      .then(() => {
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member._id === selectedMember._id
              ? { ...member, trainer_id: selectedTrainer }
              : member
          )
        );
        setShowModal(false);
        setSelectedTrainer(null);
        setSelectedMember(null);
      })
      .catch((error) => console.error("Error assigning trainer:", error));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assign Trainer to Member</h1>

      {/* Member Selection */}
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium">Select Member</label>
        <select
          onChange={(e) =>
            setSelectedMember(members.find((member) => member._id === e.target.value))
          }
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">-- Select Member --</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.first_name} {member.last_name} ({member.email})
            </option>
          ))}
        </select>
      </div>

      {/* Trainer Selection */}
      {selectedMember && (
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Select Trainer</label>
          <select
            onChange={(e) => setSelectedTrainer(trainers.find((trainer) => trainer._id === e.target.value))}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="">-- Select Trainer --</option>
            {trainers.map((trainer) => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.first_name} {trainer.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Assign Button */}
      <motion.button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        onClick={() => setShowModal(true)}
        disabled={!selectedTrainer || !selectedMember}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        Assign Trainer
      </motion.button>

      {/* Confirmation Modal */}
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-1/3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to assign {selectedTrainer?.first_name} {selectedTrainer?.last_name} to {selectedMember?.first_name} {selectedMember?.last_name} ({selectedMember?.email})?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleAssignTrainer}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Yes, Assign
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Display Assigned Trainer for Each Member */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Assigned Trainers</h2>
        <motion.ul
          className="list-none mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {members.map((member) => (
            <motion.li
              key={member._id}
              className="flex justify-between py-2 px-4 border-b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span>{member.first_name} {member.last_name} ({member.email})</span>
              <span className="text-gray-500">{member.trainer_id ? `${member.trainer_id.first_name} ${member.trainer_id.last_name}` : "No trainer assigned"}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

export default AssignTrainer;