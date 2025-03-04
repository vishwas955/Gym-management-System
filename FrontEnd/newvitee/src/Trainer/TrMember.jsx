// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const TrMember = () => {
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Trainer details (you can modify it as per requirement)
//   const trainer = {
//     name: 'John Doe',
//     contact: 'johndoe@fitness.com',
//   };

//   useEffect(() => {
//     // Simulate fetching assigned gym members (Replace with actual API call)
//     setTimeout(() => {
//       const membersData = [
//         { id: 1, name: 'Amit Sharma', age: 28, goal: 'Weight Loss', contact: 'amitsharma@gmail.com' },
//         { id: 2, name: 'Priya Verma', age: 25, goal: 'Muscle Gain', contact: 'priyaverma@gmail.com' },
//         { id: 3, name: 'Rahul Mehta', age: 30, goal: 'General Fitness', contact: 'rahulmehta@gmail.com' },
//       ];
//       setMembers(membersData);
//       setLoading(false);
//     }, 1000); // Simulating data fetch delay
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="text-xl text-gray-700">Loading Assigned Members...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       {/* Trainer's Info */}
//       <div className="mb-6 text-center">
//         <h2 className="text-3xl font-semibold text-gray-800">Trainer: {trainer.name}</h2>
//         <p className="text-gray-600">Contact: <a href={`mailto:${trainer.contact}`} className="text-blue-600">{trainer.contact}</a></p>
//       </div>

//       <h3 className="text-2xl font-semibold text-gray-800 mb-4">Assigned Gym Members</h3>
//       <p className="text-gray-600 mb-4">Total Members Assigned: {members.length}</p>

//       <div className="bg-gray-50 p-4 rounded-lg shadow-md">
//         {members.length > 0 ? (
//           <ul className="divide-y divide-gray-300">
//             {members.map((member) => (
//               <motion.li
//                 key={member.id}
//                 className="py-4 px-4 flex justify-between items-center"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <div>
//                   <h4 className="text-xl font-semibold text-gray-800">{member.name}</h4>
//                   <p className="text-gray-600">Age: {member.age}</p>
//                   <p className="text-gray-600">Goal: {member.goal}</p>
//                 </div>
//                 <a
//                   href={`mailto:${member.contact}`}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//                 >
//                   Contact
//                 </a>
//               </motion.li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-600 text-center">No members assigned yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TrMember;
