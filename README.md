# InterviewIQ.AI
# InterviewIQ.AI 🚀

> An AI-powered mock interview and preparation platform built with the **MERN** stack, **OpenRouter API**, **Firebase**, and interactive UI animations using **Motion** and **Tailwind CSS**.

---

## 📌 Overview

**InterviewIQ.AI** helps candidates practice and master job interviews. It dynamically evaluates responses, provides real-time scoring, tracks progress, and offers tailored suggestions using state-of-the-art LLMs via OpenRouter, paired with a modern and fluid user experience.

---

## ✨ Key Features

* **AI Mock Interviews:** Tailored interview questions (technical, behavioral, STAR format) powered by top AI models via **OpenRouter**.
* **Real-Time Evaluation & Feedback:** Instant scoring on clarity, correctness, and confidence with actionable improvement tips.
* **Authentication & Cloud Services:** Secure login (Google Auth / Email) and cloud storage powered by **Firebase**.
* **Fluid UI & Animations:** Smooth transitions and micro-interactions built with **Framer Motion (`motion/react`)**.
* **Modern Dashboard:** Responsive analytics to track interview performance and progress over time.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js / Vite |
| **Styling** | Tailwind CSS |
| **Animations** | Motion (Framer Motion / `motion/react`) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication & Storage** | Firebase Auth & Firebase Storage |
| **AI Integration** | OpenRouter API (GPT-4o, Claude 3.5, Llama 3, Gemini) |

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)
* [Firebase Project](https://console.firebase.google.com/) setup
* [OpenRouter API Key](https://openrouter.ai/)

---

### Installation & Setup

1. **Clone the Repository:**
   ```bash
   PORT=8000
MONGO_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
JWT_SECRET=your_jwt_secret_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:8000

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Terminal 1 (Backend):
cd server
npm run dev

# Terminal 2 (Frontend):
cd client
npm run dev

InterviewIQ.AI/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Interview, Dashboard, Home pages
│   │   ├── firebase/           # Firebase config & auth
│   │   └── App.jsx
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── package.json
│
├── server/                     # Backend (Node.js & Express)
│   ├── controllers/            # Route business logic
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # Express API routes
│   ├── services/               # OpenRouter API handlers
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
   git clone [https://github.com/your-username/InterviewIQ.AI.git](https://github.com/your-username/InterviewIQ.AI.git)
   cd InterviewIQ.AI
