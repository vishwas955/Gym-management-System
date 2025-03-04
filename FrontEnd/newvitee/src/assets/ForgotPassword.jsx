import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate(); // to redirect to the reset password page after request

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Sending request to backend to trigger the password reset email
            const response = await axios.post("http://localhost:4000/auth/User/forgot-password", { email });

            if (response.data.success) {
                toast.success("Password reset link sent! Please check your email.");
                // Redirect to a confirmation page or back to login
                navigate("/login");
            } else {
                toast.error(response.data.message || "Failed to send reset link.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    style={styles.input}
                />
                <button
                    onClick={handleForgotPassword}
                    disabled={isSubmitting}
                    style={{
                        ...styles.button,
                        backgroundColor: isSubmitting ? "#ccc" : "#000",
                    }}
                >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f9",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "20px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    button: {
        width: "100%",
        padding: "12px",
        color: "#fff",
        fontSize: "16px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
};

export default ForgotPassword;
