# MeetConnect 🎥

A modern full-stack video meeting platform for real-time collaboration.
MeetConnect combines secure authentication, instant room-based video calls, live chat, and meeting history into a clean web experience built with React, Node.js, Socket.IO, and WebRTC.

## ✨ Project Overview

MeetConnect is designed for teams, creators, and students who need lightweight browser-based video meetings without installing desktop software.

### Key Highlights
- 🔐 Secure authentication with JWT and protected routes
- 📹 Real-time video meetings powered by WebRTC
- 💬 In-meeting group chat with live delivery
- 🧾 Meeting history tracking for quick rejoin
- 👤 Account settings (profile update, password change, logout all devices)
- 🔁 Session invalidation with token versioning for stronger account security
- 📧 OTP-based password reset via email

---

## 🧰 Tech Stack

### Frontend
- React (Vite)
- React Router
- Tailwind CSS
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- JWT + bcrypt
- Nodemailer

### Database
- MongoDB
- Mongoose

### Realtime / Communication
- WebRTC (peer-to-peer media)
- STUN servers (Google STUN)

### Tooling
- ESLint
- Nodemon

---

## 🚀 Demo

### Live Demo
- 🌐 [Live App](https://your-live-demo-link.com)

### Screenshots
![Landing Page](https://via.placeholder.com/1200x700?text=MeetConnect+Landing+Screenshot)
![Dashboard](https://via.placeholder.com/1200x700?text=MeetConnect+Dashboard+Screenshot)

### GIF Previews
![Meeting Flow GIF](https://via.placeholder.com/1200x700?text=Meeting+Flow+GIF)
![Chat GIF](https://via.placeholder.com/1200x700?text=Live+Chat+GIF)

### Optional Video Preview
- 🎬 [Watch Product Walkthrough](https://your-video-link.com)

---

## ⚙️ Installation Guide

### 1) Clone the repository

```bash
git clone https://github.com/Joel112003/MeetConnect.git
cd MeetConnect
```

### 2) Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 3) Run frontend

```bash
cd frontend
npm run dev
```

### 4) Run backend

```bash
cd backend
npm run start
```

Tip for development:

```bash
cd backend
npm run test
```

(`npm run test` uses nodemon for hot-reload development in this project.)

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/meetconnect
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_app_password
SMTP_FROM=MeetConnect <no-reply@meetconnect.app>
NODE_ENV=development
```

Optional frontend env in `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## 🗂️ Folder Structure

```text
MeetConnect/
  backend/
    server.js
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/

  frontend/
    src/
      assets/
      components/
      config/
      contexts/
      hooks/
      pages/
      services/
      utils/
```

### Structure Notes
- `frontend/src/components`: reusable UI pieces (Lobby, Controls, VideoGrid, ChatPanel, etc.)
- `frontend/src/pages`: route-level screens (Landing, Dashboard, VideoMeet, History, AccountSettings)
- `backend/src/controllers`: request handlers and Socket manager
- `backend/src/services`: business logic and email services
- `backend/src/middleware`: JWT authentication and route protection

---

## 🤝 How to Fork & Contribute

Contributions are welcome and appreciated.

### 1) Fork the repository
- Click **Fork** on the top-right of the GitHub repository page.

### 2) Clone your fork

```bash
git clone https://github.com/<your-username>/MeetConnect.git
cd MeetConnect
```

### 3) Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

### 4) Make changes and commit

```bash
git add .
git commit -m "feat: add your feature summary"
```

### 5) Push and open Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request to `main` with:
- Clear title
- What changed
- Why it was needed
- Screenshots/GIFs for UI work

---

## 🌟 Features

- User registration and login
- JWT-based authorization + protected routes
- OTP password reset with email delivery
- Create and join meeting rooms using meeting code
- Live peer-to-peer video/audio calling with WebRTC
- Real-time in-meeting chat with Socket.IO
- Meeting history with rejoin support
- Profile updates and password management
- Logout from all devices using token version invalidation

---

## 🧭 Future Improvements

- Add role-based meeting controls (host/moderator permissions)
- Persist chat history to database
- Add participant mute/remove controls
- Add screen recording and downloadable meeting summaries
- Add unit + integration test coverage
- Add CI/CD workflows for automated build and lint checks
- Improve horizontal scaling for Socket.IO rooms (Redis adapter)

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this software under the terms of the MIT license.
For details, see the `LICENSE` file.

---

## 🙌 Support

If you find this project useful:
- Star the repository ⭐
- Share feedback via issues
- Contribute improvements through pull requests
