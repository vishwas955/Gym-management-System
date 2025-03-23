import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const UserFaq = () => {
    const [faqs, setFaqs] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BASE_API_URL = 'http://localhost:4000/FAQ';
    const chatHistoryRef = useRef(null);

    useEffect(() => {
        axios
            .get(`${BASE_API_URL}/get-faq`, { withCredentials: true })
            .then((res) => {
                if (res.data && Array.isArray(res.data)) {
                    setFaqs(res.data);
                } else {
                    setError("Invalid FAQ data received.");
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
                console.error("Error fetching FAQs:", err);
            });
    }, []);

    const handleQuestionClick = (index) => {
        if (faqs[index]) {
            const question = faqs[index];
            setChatHistory(prevChatHistory => [...prevChatHistory, { sender: "user", text: question.question, timestamp: new Date().toISOString() }]);

            setTimeout(() => {
                setChatHistory(prevChatHistory => [...prevChatHistory, { sender: "bot", text: question.answer, timestamp: new Date().toISOString() }]);
                scrollToBottom();
            }, 500);
        } else {
            console.error("FAQ not found at index:", index);
        }
    };

    const handleSendMessage = () => {
        setChatHistory(prevChatHistory => [...prevChatHistory, { sender: "user", text: newMessage, timestamp: new Date().toISOString() }]);
        setNewMessage('');
        scrollToBottom();

        setTimeout(() => {
            const botResponse = "Thank you for your message. We will get back to you soon.";
            setChatHistory(prevChatHistory => [...prevChatHistory, { sender: "bot", text: botResponse, timestamp: new Date().toISOString() }]);
            scrollToBottom();
        }, 500);
    };

    const scrollToBottom = () => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    return (
        <div className="max-w-4xl mx-auto mt-1 mb-10 p-0 bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col">
            <div className="bg-indigo-600 text-white p-4 text-center rounded-t-lg">
                <h2 className="text-2xl font-semibold">FAQ Chat</h2>
            </div>

            <div className="flex flex-col h-100"> {/* Fixed Height Container */}
                <div
                    ref={chatHistoryRef}
                    className="flex-grow overflow-y-auto p-4 space-y-2"  // Enable Scrolling
                >
                    {chatHistory.map((message, index) => {
                        const prevMessage = chatHistory[index - 1];
                        const isNewDay = prevMessage && new Date(message.timestamp).toLocaleDateString() !== new Date(prevMessage.timestamp).toLocaleDateString();

                        return (
                            <div key={index} className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"}`}>
                                {isNewDay && (
                                    <div className="text-center text-gray-500 mb-2 w-full">
                                        {new Date(message.timestamp).toLocaleDateString()}
                                    </div>
                                )}
                                <div
                                    className={`px-3 py-2 rounded-lg max-w-xs ${message.sender === "user" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {message.text}
                                    <div className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ Buttons */}
                {faqs.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">Quick FAQs</h3>
                        <div className="flex flex-wrap gap-2">
                            {faqs.map((faq, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuestionClick(index)}
                                    className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    {faq.question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserFaq;