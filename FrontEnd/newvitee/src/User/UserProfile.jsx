import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const [Member, setMember] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    dob: "",
    address: "",
    gender: "",
    height: "",
    weight: "",
    email: "", // Keep email in the state
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/auth/User/get-profile", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          const MemberData = response.data.gymMemberProfile;
          delete MemberData._id; // Remove _id
          setMember(MemberData);
        } else {
          console.error("Failed to fetch Gym-Member profile:", response.data.message);
        }
      })
      .catch((error) => console.error("Error fetching Gym-Member profile:", error));
  }, []);

  const handleChange = (e) => {
    setMember({
      ...Member,
      [e.target.name]: e.target.value,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!Member.first_name) newErrors.first_name = "First name is required.";
    else if (/[^a-zA-Z ]/.test(Member.first_name)) newErrors.first_name = "First name must contain only letters.";

    if (!Member.last_name) newErrors.last_name = "Last name is required.";
    else if (/[^a-zA-Z ]/.test(Member.last_name)) newErrors.last_name = "Last name must contain only letters.";

    if (!/^\d{10}$/.test(Member.phone_number)) newErrors.phone_number = "Phone number must be 10 digits.";
    if (!Member.dob) {
      newErrors.dob = "Date of birth is required.";
    } else {
      const birthDate = new Date(Member.dob);
      let today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      let monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) newErrors.dob = "You must be at least 18 years old.";
    }

    if (!Member.gender) newErrors.gender = "Gender is required.";
    if (!Member.weight) newErrors.weight = "Weight is required.";
    if (!Member.height) newErrors.height = "Height is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      setIsConfirming(true);
    }
  };

  const handleConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      try {
        // Exclude email from the update request
        const { email, ...updateData } = Member;

        const response = await axios.put(
          "http://localhost:4000/auth/User/update-Profile",
          updateData,
          { withCredentials: true }
        );
        if (response.data.success) {
          setUpdateSuccess(true);
          setIsEditing(false);
          setIsConfirming(false);
          navigate("/User/Profile"); // Navigate on successful update
        } else {
          console.error("Failed to update Gym-Member profile:", response.data.message);
        }
      } catch (error) {
        console.error("Error updating trainer profile:", error);
      }
    } else {
      setIsConfirming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        {isEditing ? "Edit Your Profile" : "Your Profile"}
      </h2>

      {updateSuccess && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
          Profile updated successfully!
        </div>
      )}

      {!isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">First Name</p>
              <p className="text-lg font-semibold text-gray-900">{Member.first_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Last Name</p>
              <p className="text-lg font-semibold text-gray-900">{Member.last_name || "N/A"}</p>
            </div>

            {/* Phone Number and Email in the same row */}
            <div>
              <p className="text-sm text-gray-600 font-medium">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">{Member.phone_number || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Email</p>
              <p className="text-lg font-semibold text-gray-900">{Member.email || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium">Date of Birth</p>
              <p className="text-lg font-semibold text-gray-900">
                {Member.dob ? new Date(Member.dob).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Gender</p>
              <p className="text-lg font-semibold text-gray-900">{Member.gender || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Height (cm)</p>
              <p className="text-lg font-semibold text-gray-900">{Member.height || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Weight (kg)</p>
              <p className="text-lg font-semibold text-gray-900">{Member.weight || "N/A"}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                value={Member.first_name || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={Member.last_name || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={Member.phone_number || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={Member.dob || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Gender</label>
              <select
                name="gender"
                value={Member.gender || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={Member.height || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={Member.weight || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      )}

      {isConfirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-4">Confirm Profile Update?</h3>
            <div className="flex justify-between">
              <button
                onClick={() => handleConfirmation(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Yes
              </button>
              <button
                onClick={() => handleConfirmation(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
