import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({setUserType}) {
  const [formMessages, setFormMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.uname.value.trim();
    const password = e.target.password.value;
    const role = e.target.userType.value;
  
    const errors = [];
    
    setSuccessMessage(""); // Clear success message on new submit
  
    // Validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.push("Please enter a valid username.");
    }
    if (!password) {
      errors.push("Password is required.");
    }
    if (!role) {
      errors.push("Please select a user type.");
    }
  
    if (errors.length > 0) {
      setFormMessages(errors); // Set all errors in state
      return;
    }
  
    try {
      // Determine the URL based on userType
      const url = "http://localhost:4000/auth/User/login";
  
      // Make API call
      const response = await axios.post(url,
        {email, password, role},
        {withCredentials: true}
      );
      console.log(response);
      if (response.data.user.role) {

        const userRole = response.data.user.role; // Get role from API response

        // const { token, user } = response.data;
  
        // Save token to localStorage for authentication purposes
        // localStorage.setItem("authToken", token);
        // localStorage.setItem("userType", user.userType);
  
        setSuccessMessage(`Successfully logged in as ${userRole}!`);
        setFormMessages([]);

        // Update role state in App.jsx
        setUserType(userRole);

         // Redirect based on user type
         if (userRole === "Admin") navigate("/Admin/AdminDashboard");
         else if (userRole === "Trainer") navigate("/Trainer/TrainerDashboard");
         else navigate("/User/UserDashboard");
      }
    } catch (error) {
      console.log(error);
      // Handle backend errors
      const backendError =
        error.response?.data?.error || "An error occurred. Please try again.";
      setFormMessages([backendError]);
    }
  };
  const backgroundImageStyle = {
    backgroundImage: `url('/images/reg.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <div className="login" style={backgroundImageStyle}>
    <div className="bg-white p-16 rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out w-1/3 mr-90">
      <section className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div>
            <label htmlFor="uname" className="block text-sm font-medium text-gray-600">
              Email:
            </label>
            <input
              type="text"
              id="email"
              name="uname"
              required
              className="mt-2 block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {formMessages.find((msg) => msg.includes("username")) && (
              <span className="text-red-500 text-xs mt-1">
                {formMessages.find((msg) => msg.includes("username"))}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-2 block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {formMessages.find((msg) => msg.includes("Password")) && (
              <span className="text-red-500 text-xs mt-1">
                {formMessages.find((msg) => msg.includes("Password"))}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              User Type:
            </label>
            <div className="mt-2 flex space-x-4">
              {/* Use flex and space-x-4 for horizontal alignment */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="admin"
                  name="userType"
                  value="Admin"
                  required
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="admin" className="text-gray-700">
                  Admin
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="trainer"
                  name="userType"
                  value="Trainer"
                  required
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="trainer" className="text-gray-700">
                  Trainer
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="member"
                  name="userType"
                  value="Member"
                  required
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="member" className="text-gray-700">
                  Gym member
                </label>
              </div>
            </div>
            {formMessages.find((msg) => msg.includes("user type")) && (
              <span className="text-red-500 text-xs mt-1">
                {formMessages.find((msg) => msg.includes("user type"))}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        {formMessages.length > 0 && (
          <div className="mt-4 bg-red-100 text-red-600 p-3 rounded-md">
            <ul className="list-disc pl-5">
              {formMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {successMessage && (
          <p className="mt-4 text-green-600 text-sm text-center">
            {successMessage}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link to="/forgotpassword" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <p className="mt-3">
            New here?{" "}
            <Link to="/Registration" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  </div>
  );
}

export default Login;
