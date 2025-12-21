#  TrustedCare – AI-Powered Smart Healthcare Platform

**TrustedCare** is an AI-driven healthcare platform that lets users **book doctor appointments**, **make secure online payments**, and **chat with an AI-powered medical assistant** to get instant answers to any health-related questions.  
It bridges the gap between healthcare and technology — combining machine learning, intelligent chatbots, and a seamless user experience.

---

##  Live Deployments

| Component | Live URL |
|------------|-----------|
|  **Frontend (User App)** | [https://trustedcare.onrender.com](https://trustedcare.onrender.com)|
|  **Admin Dashboard** | [https://trustedcare-dashboard.onrender.com](https://trustedcare-dashboard.onrender.com) |
|  **Backend API Server** | [https://trustedcare-backend-bwgc.onrender.com](https://trustedcare-backend-bwgc.onrender.com) |

---

##  Key Features

###  **Doctor Appointment System**
- Search and book appointments with verified doctors.  
- Real-time availability checking.  
- Integrated **payment gateway** for secure online booking.

### **AI-Powered Medical Chatbot**
- Ask **any medical-related question** — from symptoms to treatments.  
- Uses **medical knowledge-based LLMs** 
- Every user gets **15 free tokens per day** (auto-resets after 24 hours).  
- Option to **purchase extra tokens** for extended chatbot usage.

###  **Admin Dashboard**
- Manage doctors, patients, and appointments.  
- Secure login with role-based access control.

### **Payment Integration**
- Integrated with a secure payment API (Razorpay).  
- Supports both appointment fees and chatbot token purchases.

### **Authentication & Security**
- Encrypted user data and protected endpoints.

---

##  Tech Stack

### **Frontend**
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications
- AI Chatbot integration
  
### **Admin Dashboard**
- React.js  
- Context API for state management  


### **Backend**
- Node.js & Express.js  
- MongoDB with Mongoose  
- JWT Authentication & Middleware  
- Razorpay Integration  


---

##  Installation Guide

### Clone the Repository
```bash
git clone https://github.com/sujallgupta/trustedcare.git
cd trustedcare

i) Install Dependencies
# For Backend
cd backend
npm install

# For Frontend
cd ../frontend
npm install

# For Admin Dashboard
cd ../admin
npm install

ii) Run the Development Servers
# Backend
npm start

# Frontend
npm run dev

# Admin Dashboard
npm run dev
