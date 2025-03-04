import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./assets/Navbar.jsx";
import Header from "./Admin/Header.jsx";
import Sidebar from "./Admin/Sidebar.jsx";
import Login from "./assets/Login.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import ManageSubscription from "./Admin/ManageSubscription.jsx";
import ManageMembership from "./Admin/ManageMembership.jsx";
import Payment from "./Admin/Payment.jsx";
import TrainerDashboard from "./Trainer/TrainerDashboard.jsx"; 
import TrFeedback from "./Trainer/TrFeedback.jsx"
import AssignTrainer from "./Admin/AssignTrainer.jsx";
import WorkoutPlan from "./Admin/WorkoutPlan.jsx";
import Faq from "./Admin/Faq.jsx";
import Feedback from "./Admin/Feedback.jsx";
import UserDashboard from "./User/UserDashboard.jsx";
import Home from "./assets/Home.jsx";
import Registration from "./assets/Registration.jsx";
import axios from "axios";
import ForgotPassword from "./assets/forgotpassword.jsx";
import ResetPassword from "./assets/resetpassword.jsx";

const App = () => {
  const [role, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/auth/User/token-verification",
          { withCredentials: true }
        );
        const role = response.data.role;
        if (role) setUserType(role);
      } catch (error) {
        console.log("Error verifying token:", error);
        setUserType(null);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };
    fetchUser();
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      {role && <Sidebar />}

      <div className="flex-1">
        {role === 'Admin' && <Header />}

        <main className="p-6 bg-gray-100">
          {!role && !loading && <Navbar />}

          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <p className="text-lg font-semibold">Loading...</p>
            </div>
          ) : (
            <Routes>
              {/* Public Routes */}
              <Route path="/Home" element={<Home />} />
              <Route path="/Registration" element={<Registration />} />
              <Route path="/login" element={<Login setUserType={setUserType} />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/" element={<Home />} />

              {/* Protected Routes */}
              {role === "Admin" ? (
                <>
                  <Route path="/AdminDashboard" element={<AdminDashboard />} />
                  <Route path="/ManageSubscription" element={<ManageSubscription />} />
                  <Route path="/ManageMembership" element={<ManageMembership />} />
                  <Route path="/Payment" element={<Payment />} />
                  <Route path="/AssignTrainer" element={<AssignTrainer />} />
                  <Route path="/WorkoutPlan" element={<WorkoutPlan />} />
                  <Route path="/Faq" element={<Faq />} />
                  <Route path="/Feedback" element={<Feedback />} />
                  <Route path="/" element={<AdminDashboard />} />
                </>
              ) : role === "Trainer" ? (
                <>
                  <Route path="/Trainer/TrainerDashboard" element={<TrainerDashboard />} /> 
                  <Route path="/Trainer/Feedback" element={<TrFeedback />} />
                  <Route path="/" element={<TrainerDashboard />} />
                </>
              ) : role === "Member" ? (
                <>
                  <Route path="/UserDashboard" element={<UserDashboard />} />
                  <Route path="/" element={<UserDashboard />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
