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
import TrSidebar from "./Trainer/TrSidebar.jsx";
import TrHeader from "./Trainer/TrHeader.jsx";
import TrProfile from "./Trainer/TrProfile.jsx";
import AssignWorkoutPlan from './Trainer/TrWkPlan.jsx';
import TrAssignedMember from './Trainer/TrAssignedMember.jsx';
import UserPaymentHistory from './User/UserPaymentHistory.jsx';
import UserSidebar from './User/UserSidebar.jsx';
import UserHeader from './User/UserHeader.jsx';
import UserFeedback from './User/UserFeedback.jsx';
import UserFaq from './User/UserFaq.jsx';
import UserTrainer from "./User/UserTrainer.jsx";
import UserProfile from "./User/UserProfile.jsx";
import UserMembership from "./User/UserMembership.jsx"
import UserSubscription from "./User/UserSubscription.jsx";
import UserMakePayment from "./User/UserMakePayment.jsx";
import UserWorkoutPlan from "./User/UserWorkoutPlan.jsx"
import Reports from "./Admin/Reports.jsx";
import MembershipReport from "./Admin/MembershipReport.jsx";
import ManagePayments from "./Admin/ManagePayments.jsx";
import TrainerReport from "./Admin/TrainerReport.jsx";
import MemberReport from "./Admin/MemberReport.jsx";



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
      {role === 'Admin' && <Sidebar />}
      {role === 'Trainer' && <TrSidebar />}
      {role === 'Member' && <UserSidebar />}

      <div className="flex-1">
        {role === 'Admin' && <Header />}
        {role === 'Trainer' && <TrHeader />}
        {role === 'Member' && <UserHeader />}

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
                  <Route path="/Reports" element={<Reports />} />
                  <Route path="/MembershipReport" element={<MembershipReport />} />
                  <Route path="/ManagePayments" element={<ManagePayments />} />
                  <Route path="/TrainerReport" element={<TrainerReport />} />
                  <Route path="/MemberReport" element={<MemberReport />} />
                </>
              ) : role === "Trainer" ? (
                <>
                  <Route path="/Trainer/TrainerDashboard" element={<TrainerDashboard />} /> 
                  <Route path="/Trainer/Feedback" element={<TrFeedback />} />
                  <Route path="/Trainer/Profile" element={<TrProfile />} />
                  <Route path="/Trainer/TrWkPlan" element={<AssignWorkoutPlan />} />
                  <Route path="/Trainer/assignedmembers" element={<TrAssignedMember />} />
                  <Route path="/" element={<TrainerDashboard />} />
                </>
              ) : role === "Member" ? (
                <>
                  <Route path="/User/UserDashboard" element={<UserDashboard />} />
                  <Route path="/User/UserPaymentHistory" element={<UserPaymentHistory />} />
                  <Route path="/User/UserFeedback" element={<UserFeedback />} />
                  <Route path="/User/UserFAQ" element={<UserFaq />} />
                  <Route path="/User/AssignedTrainer" element={<UserTrainer />} />
                  <Route path="/User/Profile" element={<UserProfile />} />
                  <Route path="/User/UserSubscritpion" element={<UserSubscription />} />
                  <Route path="/User/UserMembership" element={<UserMembership />} />
                  <Route path="/User/UserWorkoutPlan" element={<UserWorkoutPlan />} />
                  <Route path="/User/UserPayment/:planId" element={<UserMakePayment />} />
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
