import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom"; // Removed <Router> wrapper
import Navbar from "./assets/Navbar.jsx";
import Header from "./Admin/Header.jsx";
import Sidebar from "./Admin/Sidebar.jsx";
import Login from "./assets/Login.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import ManageSubscription from "./Admin/ManageSubscription.jsx";
import ManageMembership from "./Admin/ManageMembership.jsx";
import Payment from "./Admin/Payment.jsx";
import TrainerDashboard from "./Trainer/TrainerDashboard.jsx"; 
import AssignTrainer from "./Admin/AssignTrainer.jsx";
import WorkoutPlan from "./Admin/WorkoutPlan.jsx";
import Faq from "./Admin/Faq.jsx";
import Feedback from "./Admin/Feedback.jsx";
import UserDashboard from "./User/UserDashboard.jsx";
import Home from "./assets/Home.jsx";
import Registration from "./assets/Registration.jsx";
import axios from "axios";

const App = () => {
  const [role, setUserType] = useState(null);
  const location = useLocation(); // Now works properly

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/auth/User/token-verification",
          { withCredentials: true }
        );
        let role = response.data.role;
        if (isMounted && role) {
          setUserType(role);
        }
      } catch (error) {
        if (isMounted) setUserType(null);
        console.log(error);
      }
    };
    fetchUser();
    return () => {
      isMounted = false; // Cleanup
    };
  }, [location.pathname]); // Track path changes instead of full location object

  return (
    // Removed <Router> wrapper (it should be in index.js)
    <div className="flex min-h-screen">
      {/* Sidebar should only be visible if logged in */}
      {role ==='Admin' && <Sidebar /> || role ==='Trainer' && <TrSidebar /> || role ==='Member' && <UserSidebar />}

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header should only be visible if logged in */}
        {role ==='Admin' && <Header /> || role ==='Trainer' && <TrHeader /> || role ==='Member' && <UserHeader />}

        {/* Dynamic Content */}
        <main className="p-6 bg-gray-100">
          {/* Show Navbar only on public pages */}
          {!role && <Navbar />}
          <Routes>
            {/* Public Routes */}
            <Route path="/Home" element={<Home />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/login" element={<Login setUserType={setUserType} />} />
            <Route path="/" element={<Home />} />

            {/* Protected Routes */}
            {role === "Admin" ? (
              <div className="flex min-h-screen w-full">
              <Sidebar />
              <div className="flex-1 flex flex-col w-full">
                <Header />
                <main className="p-6 bg-gray-100 flex-1">
                  <Routes>
                    {/* Admin Routes */}
                    <Route path="/admindashboard" element={<AdminDashboard />} />
                    <Route path="/managesubscription" element={<ManageSubscription />} />
                    <Route path="/managemembership" element={<ManageMembership />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/assigntrainer" element={<AssignTrainer />} />
                    <Route path="/workoutplan" element={<WorkoutPlan />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/feedback" element={<Feedback />} />
                  </Routes>
                </main>
              </div>
            </div>
            ) : role === "Trainer" ? (
              <>
                <Route path="/Trainer/TrainerDashboard" element={<TrainerDashboard />} /> 
                <Route path="/" element={<Navigate to="/Trainer/TrainerDashboard" />} />
              </>
            ) : role === "Member" ? (
              <>
                <Route path="/User/UserDashboard" element={<UserDashboard />} />
                <Route path="/" element={<Navigate to="/User/UserDashboard" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;