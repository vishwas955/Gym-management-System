import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AssignTrainer = () => {
  // Dummy data for members and trainers
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", assignedTrainer: "" },
    { id: 2, name: "Jane Smith", assignedTrainer: "" },
    { id: 3, name: "Michael Lee", assignedTrainer: "" },
    { id: 4, name: "Sara Green", assignedTrainer: "" },
  ]);
  
  const [trainers] = useState([
    { id: 1, name: "Trainer A" },
    { id: 2, name: "Trainer B" },
    { id: 3, name: "Trainer C" },
  ]);

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Handle assigning trainer to member
  const handleAssignTrainer = () => {
    const updatedMembers = members.map((member) =>
      member.id === selectedMember.id
        ? { ...member, assignedTrainer: selectedTrainer.name }
        : member
    );
    setMembers(updatedMembers);
    setShowModal(false);
    setSelectedTrainer(null);
    setSelectedMember(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assign Trainer to Member</h1>

      {/* Member Selection */}
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium">Select Member</label>
        <select
          onChange={(e) =>
            setSelectedMember(
              members.find((member) => member.id === parseInt(e.target.value))
            )
          }
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="">-- Select Member --</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* Trainer Selection */}
      {selectedMember && (
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Select Trainer</label>
          <select
            onChange={(e) => setSelectedTrainer(trainers.find((trainer) => trainer.id === parseInt(e.target.value)))}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="">-- Select Trainer --</option>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.name}
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
              Are you sure you want to assign {selectedTrainer?.name} to{" "}
              {selectedMember?.name}?
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
              key={member.id}
              className="flex justify-between py-2 px-4 border-b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span>{member.name}</span>
              <span className="text-gray-500">{member.assignedTrainer || "No trainer assigned"}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

export default AssignTrainer;
