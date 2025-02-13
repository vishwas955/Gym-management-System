import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Registration() {
  const [formMessages, setFormMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const first_name = form.first_name.value.trim();
    const last_name = form.last_name.value.trim();
    const email = form.email.value.trim();
    const phone_number = form.phone.value.trim();
    const dob = form.dob.value;
    const gender = form.gender.value;
    const role = form.role.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    let errors = [];
    setSuccessMessage("");

    // Validation
    if (!first_name || !/^[a-zA-Z\s]+$/.test(first_name)) {
      errors.push("First Name is required and must contain only letters.");
    }

    if (!last_name || !/^[a-zA-Z\s]+$/.test(last_name)) {
      errors.push("Last Name is required and must contain only letters.");
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

    if (!gender) {
      errors.push("Please select a gender.");
    }

    if (!role) {
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
      const url = "http://localhost:4000/auth/User/register";

      const response = await axios.post(url, {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        dob,
        gender,
        role,
      });

      if (response.data) {
        setSuccessMessage(`Registration successful as ${role}!`);
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
    <div className="flex flex-col items-center justify-center bg-gray-100 h-screen px-8">
      <section className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Register Now
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              First Name:
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Contact Number:
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Date of Birth:
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              User Type:
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="">-- Select User Type --</option>
              <option value="Member">Gym Member</option>
              <option value="Trainer">Trainer</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white font-semibold py-2 rounded-lg hover:bg-yellow-300 transition duration-300"
          >
            Submit
          </button>
        </form>
        {formMessages.length > 0 && (
          <div className="bg-red-100 text-red-800 p-4 mt-4 rounded-lg">
            <ul className="list-disc list-inside">
              {formMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
        {successMessage && (
          <p className="text-green-600 text-center mt-4">{successMessage}</p>
        )}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link
            to="/Login"
            className="text-yellow-500 hover:underline font-medium"
          >
            Log in!
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Registration;