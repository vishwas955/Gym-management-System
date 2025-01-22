import React, { useState } from "react";
import "../styles/Login.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formMessages, setFormMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.uname.value.trim();
    const password = e.target.password.value;
    const userType = e.target.userType.value;
  
    const errors = [];
    setSuccessMessage(""); // Clear success message on new submit
  
    // Validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.push("Please enter a valid username.");
    }
    if (!password) {
      errors.push("Password is required.");
    }
    if (!userType) {
      errors.push("Please select a user type.");
    }
  
    if (errors.length > 0) {
      setFormMessages(errors); // Set all errors in state
      return;
    }
  
    try {
      // Determine the URL based on userType
      const url =
        userType === "Trainer"
          ? "http://localhost:4000/auth/Trainer/login"
          : "http://localhost:4000/auth/GymMember/login";
  
      // Make API call
      const response = await axios.post(url, {
        email,
        password,
      });
  
      if (response.data) {
        //const { token, user } = response.data;
  
        // Save token to localStorage for authentication purposes
        //localStorage.setItem("authToken", token);
        //localStorage.setItem("userType", user.userType);
  
        setSuccessMessage(`Successfully logged in as ${userType}!`);
        setFormMessages([]);
      }
    } catch (error) {
      // Handle backend errors
      const backendError =
        error.response?.data?.error || "An error occurred. Please try again.";
      setFormMessages([backendError]);
    }
  };
  

  


  return (
    <div className="login">
      <section>
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="uname">Email:</label>
          <input
            type="text"
            id="email"
            name="uname"
            required
            aria-describedby="unameError"
          />
          <span id="unameError" className="error-message">
            {formMessages.find((msg) => msg.includes("username"))}
          </span>

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            aria-describedby="passwordError"
          />
          <span id="passwordError" className="error-message">
            {formMessages.find((msg) => msg.includes("Password is required"))}
          </span>

          <label htmlFor="userType">User Type:</label>
          <select
            id="userType"
            name="userType"
            required
            aria-describedby="userTypeError"
          >
            <option value="">Select User Type</option>
            <option value="Admin">Admin</option>
            <option value="Trainer">Trainer</option>
            <option value="User">User</option>
          </select>
          <span id="userTypeError" className="error-message">
            {formMessages.find((msg) => msg.includes("user type"))}
          </span>

          <button type="submit">Login</button>
        </form>

        {formMessages.length > 0 && (
          <div className="error-summary">
            <ul>
              {formMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="additional-links">
          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
          <p className="register-message">
            New here?{" "}
            <Link to="/Registration" className="register-link">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
