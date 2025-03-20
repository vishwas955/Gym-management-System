import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TrProfile = () => {
    const [trainer, setTrainer] = useState({
        first_name: "",
        last_name: "",
        phone_no: "",
        dob: "",
        address: "",
        gender: "",
        expertise: "",
        certificate: "",
    });
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:4000/trainer/profile", { withCredentials: true })
            .then((response) => {
                if (response.data.success) {
                    const trainerData = response.data.TrainerProfile;
                    delete trainerData._id; // Remove _id
                    setTrainer(trainerData);
                } else {
                    console.error("Failed to fetch trainer profile:", response.data.message);
                }
            })
            .catch((error) => console.error("Error fetching trainer profile:", error));
    }, []);

    const handleChange = (e) => {
        setTrainer({
            ...trainer,
            [e.target.name]: e.target.value,
        });
    };

    const validateFields = () => {
        const newErrors = {};
        if (!trainer.first_name) newErrors.first_name = "First name is required.";
        else if (/[^a-zA-Z ]/.test(trainer.first_name)) newErrors.first_name = "First name must contain only letters.";

        if (!trainer.last_name) newErrors.last_name = "Last name is required.";
        else if (/[^a-zA-Z ]/.test(trainer.last_name)) newErrors.last_name = "Last name must contain only letters.";

        if (!/^\d{10}$/.test(trainer.phone_no)) newErrors.phone_no = "Phone number must be 10 digits.";
        if (!trainer.dob) {
            newErrors.dob = "Date of birth is required.";
        } else {
            const birthDate = new Date(trainer.dob);
            let today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            let monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) newErrors.dob = "You must be at least 18 years old.";
        }

        if (!trainer.gender) newErrors.gender = "Gender is required.";
        if (!trainer.expertise) newErrors.expertise = "Expertise is required.";
        if (!trainer.certificate) newErrors.certificate = "Certificate is required.";

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
                const response = await axios.put(
                    "http://localhost:4000/trainer/update-profile",
                    trainer,
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setUpdateSuccess(true);
                    setIsEditing(false);
                    setIsConfirming(false);
                } else {
                    console.error("Failed to update trainer profile:", response.data.message);
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
                        {Object.entries(trainer).map(([key, value]) => (
                            <div key={key}>
                                <p className="text-sm text-gray-600 font-medium">{key.replace("_", " ")}</p>
                                {key === "dob" ? (
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(value).toLocaleDateString()}
                                    </p>
                                ) : (
                                    <p className="text-lg font-semibold text-gray-900">{value || "N/A"}</p>
                                )}
                            </div>
                        ))}
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
                        {Object.keys(trainer).map((key) => (
                            <div key={key}>
                                <label className="text-sm text-gray-600 font-medium">
                                    {key.replace("_", " ")}
                                </label>
                                <input
                                    type={key === "dob" ? "date" : "text"}
                                    name={key}
                                    value={trainer[key] || ""}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                                {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
                            </div>
                        ))}
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

export default TrProfile;