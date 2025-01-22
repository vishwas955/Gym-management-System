import React, { useState } from "react";
import "../styles/Registration.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Registration() {
  const [formMessages, setFormMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.name.value.trim();
    const email = form.email.value.trim();
    const phone_number = form.phone.value.trim();
    const dob = form.dob.value;
    const userType = form.userType.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    let errors = [];
    setSuccessMessage("");

    // Validation
    if (!username || !/^[a-zA-Z\s]+$/.test(username)) {
      errors.push("Name is required and must contain only letters and spaces.");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please enter a valid email address.");
    }

    if (!phone_number || !/^\d{10}$/.test(phone_number)) {
      errors.push("Contact number must be a valid 10-digit number.");
    }

    if (!dob) {
      errors.push("Date of Birth is required.");
    } else {
      let today = new Date();
      let dobDate = new Date(dob);
      let age = today.getFullYear() - dobDate.getFullYear();
      let m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 18) {
        errors.push("You must be at least 18 years old.");
      }
    }

    if (!userType) {
      errors.push("Please select a user type.");
    }

    if (!password || password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      setFormMessages(errors);
      return;
    }

    // If validation passes, make the API call
    try {
      const url =
        userType === "Trainer"
          ? "http://localhost:4000/auth/Trainer/register"
          : "http://localhost:4000/auth/GymMember/register";

      const response = await axios.post(url, {
        username,
        email,
        password,
        phone_number,
        dob,
      });

      if (response.data) {
        setSuccessMessage(`Registration successful as ${userType}!`);
        setFormMessages([]);
        form.reset(); // Reset form fields
      }
    } catch (error) {
      const backendErrors =
        error.response && error.response.data && error.response.data.errors
          ? error.response.data.errors
          : ["An error occurred. Please try again later."];
      setFormMessages(backendErrors);
    }
  };

  return (
    <div className="register">
      <section>
        <h2>Register Now</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Name:</label>
          <input type="text" id="username" name="name" required aria-describedby="nameError" />
          <span id="nameError" className="error-message">
            {formMessages.find((msg) => msg.includes("Name"))}
          </span>

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required aria-describedby="emailError" />
          <span id="emailError" className="error-message">
            {formMessages.find((msg) => msg.includes("email"))}
          </span>

          <label htmlFor="phone">Contact Number:</label>
          <input type="text" id="phone_number" name="phone" required aria-describedby="phoneError" />
          <span id="phoneError" className="error-message">
            {formMessages.find((msg) => msg.includes("Contact number"))}
          </span>

          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" id="dob" name="dob" required aria-describedby="dobError" />
          <span id="dobError" className="error-message">
            {formMessages.find((msg) => msg.includes("Date of Birth") || msg.includes("18"))}
          </span>

          <label htmlFor="userType">User Type:</label>
          <select id="userType" name="userType" required aria-describedby="userTypeError">
            <option value="">-- Select User Type --</option>
            <option value="GymMember">Gym Member</option>
            <option value="Trainer">Trainer</option>
          </select>
          <span id="userTypeError" className="error-message">
            {formMessages.find((msg) => msg.includes("user type"))}
          </span>

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required aria-describedby="passwordError" />
          <span id="passwordError" className="error-message">
            {formMessages.find((msg) => msg.includes("Password must"))}
          </span>

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            aria-describedby="confirmPasswordError"
          />
          <span id="confirmPasswordError" className="error-message">
            {formMessages.find((msg) => msg.includes("Passwords do not match"))}
          </span>

          <button type="submit">Submit</button>
        </form>
        <p>
          Already have an account?{" "}
          <Link to="/Login">
            Log in!
          </Link>
        </p>
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
      </section>
    </div>
  );
}

export default Registration;
