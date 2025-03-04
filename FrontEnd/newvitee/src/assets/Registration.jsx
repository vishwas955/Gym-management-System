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
  const backgroundImageStyle = {
    backgroundImage: `url('/images/reg.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  return (
    <div
    className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center"
    style={backgroundImageStyle}
  > {/* Outer Container */}
      <div className="relative w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Background Pattern (Subtle Circles) */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_80px_at_50%_50%,rgba(200,200,200,0.15),transparent)]"
          style={{ opacity: 0.9 }}
        />

        {/* Form Section */}
        <section className="relative p-8">
          {/* Optional Logo (Replace with your actual logo) */}
          <div className="absolute top-4 right-4">
          <img
          src="/Caliber_Logo.png" // Path to your logo image in the public folder
          alt="Logo"
          className="h-10 w-10" // Adjust size as needed
        />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 4.75 7.5 4.75a8.281 8.281 0 00-8.203 2.034m16.406 0A8.287 8.287 0 0116.5 4.75c-1.746 0-3.332.727-4.5 1.506v13"
              ></path>
            
          </div>

          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
            Join Our Community
          </h2>
          <p className="text-md text-gray-600 text-center mb-8">
            Create an account to unlock exclusive features.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="mt-2 flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Male"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="male" className="ml-2 block text-sm text-gray-800">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Female"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="female" className="ml-2 block text-sm text-gray-800">
                    Female
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="other"
                    name="gender"
                    value="Other"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="other" className="ml-2 block text-sm text-gray-800">
                    Other
                  </label>
                </div>
              </div>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Type
              </label>
              <div className="mt-2 flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="admin"
                    name="role"
                    value="Admin"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="admin" className="ml-2 block text-sm text-gray-800">
                    Admin
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="trainer"
                    name="role"
                    value="Trainer"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="trainer" className="ml-2 block text-sm text-gray-800">
                    Trainer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="member"
                    name="role"
                    value="Member"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="member" className="ml-2 block text-sm text-gray-800">
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Error Messages */}
          {formMessages.length > 0 && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    There were some errors with your submission
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {formMessages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/Login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Registration;