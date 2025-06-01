# 🏋️‍♂️ Caliber Fitness

**Stay Fit, Stay Strong, Stay Organized!** 💪🚀

## 📌 Overview
**Caliber Fitness** is a feature-rich MERN stack application crafted to streamline and elevate gym operations. From member management to personalized trainer assignments, performance analytics, and payment handling – the system ensures smooth operations for admins, trainers, and gym members alike. With an integrated chatbot for real-time assistance, it's built for both power and scalability! 🤖

## ✨ Features

### For Gym Members 🏋️
- 📄 **Personal Dashboard** – Access membership details and payment history.
- 🔄 **Membership Management** – Upgrade, renew, or cancel plans easily.
- 🏆 **Workout Plans** – Monitor workouts and routines.
- 🗓️ **Calendar-based Report Filtering** – Analyze activity on daily/weekly/monthly basis.

### For Gym Admins 🏢
- 📂 **Admin Dashboard** – Central hub to manage members and system data.
- 🧑‍🏫 **Trainer Assignment** – Link trainers with members seamlessly.
- 💳 **Payment Management** – Track and maintain payment records.
- 📊 **Automated Report Generation** – Weekly, Monthly, and Annual reports with **CSV/PDF** export support.
- 💬 **Chatbot Integration** – Answers queries from a backend knowledge base.
- 📝 **Manage Subscription Plans** – Create, update, or disable plans.
- 💬 **Feedback Moderation** – View feedbacks and disable inappropriate feedbacks.
- 🏋️‍♀️ **Workout Plan Management** – Add general workout templates for members.

### For Trainers 🏋️‍♂️
- 📋 **Trainer Dashboard** – View assigned members and plan their routines.
- 🏋️‍♂️ **Workout Plan Management** – Assign workout plans to the members.
- 📈 **Track Member Progress** – Help members improve by tracking and reviewing their progress.

## 🛠️ Tech Stack
- **Frontend**: React.js ⚛️, Tailwind CSS 🎨
- **Backend**: Node.js, Express.js 🚀
- **Database**: MongoDB 🍃
- **Authentication**: JWT + HTTP-only Cookies 🔐

## 🧪 Environment Setup

Create a `.env` file in the backend root with the following variables:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Email
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

---

🚀 **Caliber Fitness – Elevate Your Fitness Journey!** 🏋️‍♂️🔥
