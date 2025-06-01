# 🏋️‍♂️ Caliber Fitness

**Stay Fit, Stay Strong, Stay Organized!** 💪🚀

## 📌 Overview
**Caliber Fitness** is a feature-rich MERN stack application crafted to streamline and elevate gym operations. From member management to personalized trainer assignments, performance analytics, and payment handling – the system ensures smooth operations for admins, trainers, and gym members alike. With an integrated chatbot for real-time assistance, it's built for both power and scalability! 🤖

## ✨ Features

### For Gym Members 🏋️
- 📄 **Personal Dashboard** – Access membership details and payment history.
- 🔄 **Membership Management** – Upgrade, renew, or cancel plans easily.
- 🏆 **Progress Tracking** – Monitor workouts, routines, and personal achievements.
- 📊 **Reports & Insights** – View fitness stats over time.
- 🗓️ **Calendar-based Report Filtering** – Analyze activity on daily/weekly/monthly basis.

### For Gym Admins 🏢
- 📂 **Admin Dashboard** – Central hub to manage members and system data.
- 🧑‍🏫 **Trainer Assignment** – Link trainers with members seamlessly.
- 💳 **Payment Management** – Track and maintain payment records.
- 📊 **Automated Report Generation** – Weekly, Monthly, and Annual reports with **CSV/PDF** export support.
- 💬 **Chatbot Integration** – Answers queries from a backend knowledge base.
- 📝 **Manage Subscription Plans** – Create, update, or disable plans.
- 💬 **Feedback Moderation** – View and disable inappropriate content.
- 🏋️‍♀️ **Workout Plan Management** – Add general workout templates for members.

### For Trainers 🏋️‍♂️
- 📋 **Trainer Dashboard** – View assigned members and plan their routines.
- 🏋️‍♂️ **Workout Plan Management** – Create personalized fitness routines.
- 📈 **Track Member Progress** – Help members improve by tracking and reviewing their progress.

## 🛠️ Tech Stack
- **Frontend**: React.js ⚛️, Tailwind CSS 🎨
- **Backend**: Node.js, Express.js 🚀
- **Database**: MongoDB 🍃
- **Authentication**: JWT + HTTP-only Cookies 🔐
- **File Upload**: Multer & Cloudinary ☁️

## 📌 Future Enhancements
- 📅 **Class & Training Session Scheduling**
- 🔗 **Payment Gateway Integration** (e.g., Razorpay/Stripe)
- 📲 **Mobile Application**
- 📈 **Advanced Analytics**
- 🎤 **Voice-Based Chatbot**
- 🗓️ **Attendance Tracking for Gym Members**
- 🥗 **Nutritionist Integration**
- 🛍️ **Product Recommendation Engine**
- 🎯 **Fitness Challenges & Rewards**
- 📩 **Automated Notifications & Reminders**

## 🧪 Environment Setup

Create a `.env` file in the backend root with the following variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional for notifications)
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## ▶️ How to Run the Project

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## 💡 Contributing

Love fitness and code? Fork the repo, suggest features, or raise issues to make Caliber Fitness even better. Contributions are always welcome! 💥

## 📞 Contact

- 📧 Email: your-email@example.com
- 🐙 GitHub: [your-github](https://github.com/your-username)

---

🚀 **Caliber Fitness – Elevate Your Fitness Journey!** 🏋️‍♂️🔥