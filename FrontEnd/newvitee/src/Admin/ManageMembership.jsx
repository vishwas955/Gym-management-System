import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageMemberships = () => {
    const [memberships, setMemberships] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState("");
    const [newSubscriptionId, setNewSubscriptionId] = useState("");
    const [newStartDate, setNewStartDate] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true); // Added loading state

    useEffect(() => {
        fetchMemberships();
        fetchSubscriptions();
    }, []);

    useEffect(() => {
        console.log("Subscriptions State on Render:", subscriptions);
    }, [subscriptions]);

    const fetchMemberships = async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:4000/membership/get-membership",
                { withCredentials: true }
            );
            setMemberships(data.memberships);
        } catch (error) {
            toast.error("Failed to fetch memberships");
        }
    };

    const fetchSubscriptions = async () => {
        setIsLoadingSubscriptions(true); // Start loading
        try {
            const { data } = await axios.get("http://localhost:4000/subscription/get-subscription", {
                withCredentials: true,
            });
            setSubscriptions(data.subscriptions || []);
            console.log("Fetched Subscriptions:", data.subscriptions);
        } catch (error) {
            console.error("Failed to fetch subscription plans");
            setSubscriptions([]);
            toast.error("Failed to fetch subscription plans");
        } finally {
            setIsLoadingSubscriptions(false); // End loading whether success or fail
        }
    };

    const handleEditClick = (membership) => {
        setSelectedMembership(membership);
        setShowModal(true);
        setSelectedSubscriptionId(membership.subscriptionId?._id || "");
        setStartDate(membership.startDate?.split("T")[0] || "");
        //CRUCIAL:  Open the update modal only *after* subscriptions are loaded
        //and the `isLoadingSubscriptions` state is false
    };

    useEffect(() => {
      if (showModal && !isLoadingSubscriptions) {
        setShowUpdateModal(true);
      }
    }, [showModal, isLoadingSubscriptions]);



    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMembership(null);
        setSelectedSubscriptionId("");
        setStartDate("");
        setShowUpdateModal(false); // Also close the update modal on general close
    };

    const handleUpdateMembership = async (e, membershipId) => {
        e.preventDefault();
        try {
            if (!newSubscriptionId || !newStartDate) {
                toast.error("Please provide valid inputs for updating!");
                return;
            }

            const payload = {
                subscriptionId: newSubscriptionId,
                startDate: newStartDate,
            };

            const response = await axios.put(
                `http://localhost:4000/membership/update-membership/${membershipId}`,
                payload,
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success("Membership updated successfully!");
                fetchMemberships();
                setShowUpdateModal(false);
                handleCloseModal();
            } else {
                toast.error(response.data.error || "Failed to update membership");
            }
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("An error occurred while updating the membership");
        }
    };

    const handleDisableMembership = async () => {
        if (window.confirm("Are you sure you want to disable this membership?")) {
            try {
                await axios.delete(
                    `http://localhost:4000/membership/delete-membership/${selectedMembership?._id}`,
                    { withCredentials: true }
                );
                toast.success("Membership disabled successfully");
                fetchMemberships();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to disable membership");
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Memberships</h1>
            <div className="grid grid-cols-2 gap-4">
                {memberships?.map((membership) => (
                    <div key={membership._id} className="p-4 border rounded-lg shadow">
                        <div className="flex justify-between mb-2">
                            <div className="w-1/2">
                                <strong>Start:</strong>{" "}
                                <span>{new Date(membership.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="w-1/2 text-right">
                                <strong>End:</strong>{" "}
                                <span>{new Date(membership.endDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="w-1/2">
                                <strong>Member:</strong>{" "}
                                <span>
                                    {membership.gymMemberId?.first_name} {membership.gymMemberId?.last_name}
                                </span>
                            </div>
                            <div className="w-1/2 text-right">
                                <strong>Status:</strong>{" "}
                                <span>{membership.status}</span>
                            </div>
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
                            onClick={() => handleEditClick(membership)}
                            disabled={isLoadingSubscriptions}
                        >
                            Edit
                        </button>

                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl mb-4">Edit Membership</h2>
                        <p>Membership ID: {selectedMembership?._id}</p>
                        <p>Status: {selectedMembership?.status}</p>

                        {selectedMembership?.status !== "Cancelled" ? (
                            <>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={() => setShowUpdateModal(true)}
                                    disabled={isLoadingSubscriptions}
                                >
                                    Update Membership
                                </button>
                                {isLoadingSubscriptions && <p>Loading subscriptions...</p>}

                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleDisableMembership(selectedMembership?._id)}
                                >
                                    Disable Membership
                                </button>
                            </>
                        ) : (
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowUpdateModal(true)}
                                disabled={isLoadingSubscriptions}
                            >
                                Update Membership
                            </button>
                        )}

                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showUpdateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl mb-4">Update Membership Details</h2>

                        <form
                            onSubmit={(e) => handleUpdateMembership(e, selectedMembership?._id)}
                        >
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Select New Subscription Plan:</label>
                                <select
                                    className="border p-2 rounded w-full mb-4"
                                    value={newSubscriptionId}
                                    onChange={(e) => setNewSubscriptionId(e.target.value)}
                                    disabled={isLoadingSubscriptions}
                                >
                                    <option value="">Select Subscription Plan</option>
                                    {subscriptions && subscriptions.length > 0 ? (
                                        subscriptions.map((subscription) => (
                                            <option key={subscription._id} value={subscription._id}>
                                                {subscription.name} - {subscription.duration} months
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No Subscription Plans Available</option>
                                    )}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">New Start Date:</label>
                                <input
                                    type="date"
                                    value={newStartDate}
                                    onChange={(e) => setNewStartDate(e.target.value)}
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Confirm Update
                            </button>

                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowUpdateModal(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMemberships;
