<p align="center">
  <img src="frontend/src/assets/images/MeetConnect.png" width="80" height="80" alt="MeetConnect Logo" />
</p>

<h1 align="center">MeetConnect</h1>
<p align="center">
  <strong>Real-time video conferencing with Google Calendar integration</strong>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=flat&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-9-47A248?style=flat&logo=mongodb" />
  <img src="https://img.shields.io/badge/WebRTC-P2P-333?style=flat&logo=webrtc" />
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=flat&logo=socket.io" />
  <img src="https://img.shields.io/badge/Redis-Rate%20Limiting-DC382D?style=flat&logo=redis" />
</p>

---

## 📋 Description

MeetConnect is a production-grade video conferencing platform built from scratch. Users can create instant meetings, schedule future sessions with Google Calendar sync, join via shareable codes, and communicate through real-time chat and emoji reactions — all through a premium, mobile-first responsive UI.

---

## ✨ Features

| Category | Features |
|----------|----------|
| **Video Conferencing** | Peer-to-peer WebRTC video/audio, multi-participant mesh, mic/camera toggle, screen sharing |
| **Meeting Management** | Instant room creation, scheduled meetings with attendees, meeting history tracking |
| **Google Calendar** | OAuth2 integration (cross-origin popup fix), auto-sync create/update/delete/cancel |
| **Authentication** | Email/password login, Google OAuth login, JWT with HTTP-only cookies, brute-force protection |
| **Password Recovery** | 3-step OTP flow via email (request → verify → reset) |
| **Account Management** | Profile editing, password change, logout all devices (token versioning) |
| **Real-time Chat** | In-meeting messaging with persistent history (Redis), sender names, timestamps |
| **Emoji Reactions** | Live emoji overlay animations broadcast to all participants |
| **Security** | Rate limiting (Redis-backed), bcrypt hashing, AES-encrypted OAuth tokens, CORS whitelist, session store validation |
| **Performance** | MongoDB indexes on all hot query paths, Redis adapter for Socket.IO, lazy-loaded routes with idle prefetch |
| **UI/UX** | Mobile-first responsive design, skeleton loading states, dark mode, micro-animations |

---

## 🛠 Tech Stack

### Frontend
- **React 19** — SPA with lazy loading + idle prefetch for critical routes
- **Vite 8** — Fast build tool and dev server
- **Tailwind CSS 4** — Utility-first styling
- **WebRTC** — Native browser API for peer-to-peer media streams
- **Socket.IO Client 4** — Real-time signaling, chat, and emoji events
- **React Router 7** — Client-side routing with protected route guards

### Backend
- **Express 5** — REST API server (ESM modules)
- **MongoDB + Mongoose 9** — Document database with compound indexes
- **Socket.IO 4** — WebSocket server for signaling + Redis adapter for multi-instance
- **JWT + bcrypt** — Authentication and password hashing
- **Google APIs** — OAuth2 + Calendar API v3 with encrypted token storage
- **Nodemailer** — Email delivery for OTP password reset
- **Redis** — Rate limiting storage + Socket.IO pub/sub adapter + chat history + room registry

---

## 📁 Folder Structure

```
MeetConnect/
├── backend/
│   ├── server.js                    # Entry point — Express + Socket.IO init
│   └── src/
│       ├── config/
│       │   ├── db.js                # MongoDB connection (bufferCommands off)
│       │   └── redisClient.js       # Redis client setup
│       ├── controllers/
│       │   ├── auth.controllers.js  # Login, register, Google OAuth, OTP password reset
│       │   ├── meeting.controllers.js # CRUD meetings, Google Calendar sync, connect-token
│       │   ├── account.controllers.js # Profile update, password change
│       │   ├── history.controllers.js # Meeting history tracking
│       │   └── SocketManager.js     # Socket.IO signaling, room registry, chat, emoji
│       ├── middleware/
│       │   ├── auth.middleware.js    # JWT verification + session + token versioning
│       │   └── rateLimiter.middleware.js # Rate limiting (global + route-specific)
│       ├── models/
│       │   ├── user.model.js        # User schema + OTP/brute-force fields + indexes
│       │   ├── meeting.model.js     # Meeting history schema + compound index
│       │   ├── scheduledMeeting.model.js # Scheduled meetings + 4 query indexes
│       │   └── oauthCredential.model.js # Encrypted Google OAuth tokens + unique index
│       ├── routes/
│       │   ├── users.routes.js      # Auth + history routes
│       │   ├── account.routes.js    # Profile + security routes
│       │   └── meeting.routes.js    # Meeting CRUD + Google Calendar routes
│       ├── services/
│       │   ├── account.service.js   # Business logic for profile/password
│       │   ├── email.service.js     # Nodemailer OTP email sender
│       │   └── googleCalendar.service.js # Google Calendar CRUD + token encryption
│       └── utils/
│           ├── authToken.js         # JWT sign/verify + HTTP-only cookie helpers
│           ├── cryptoToken.js       # AES token encryption for OAuth credentials
│           ├── sessionStore.js      # Redis session store (create/validate/clear)
│           ├── userMapper.js        # Strip sensitive fields from user objects
│           ├── responses.js         # Standardised API response helpers
│           └── meeting.js           # Meeting code normalization
│
├── frontend/
│   └── src/
│       ├── App.jsx                  # Router + lazy loading + idle route prefetch
│       ├── main.jsx                 # React entry point
│       ├── index.css                # Global styles + animations
│       ├── pages/
│       │   ├── Landing.jsx          # Marketing hero page
│       │   ├── Login.jsx            # Email/password + Google OAuth login
│       │   ├── SignupPage.jsx       # Registration form with username availability check
│       │   ├── ForgotPassword.jsx   # 3-step OTP password recovery flow
│       │   ├── Dashboard.jsx        # Main hub — stats, actions, scheduled meetings list
│       │   ├── VideoMeet.jsx        # Video call — code validation → lobby → meeting room
│       │   ├── History.jsx          # Past meeting history list
│       │   ├── AccountSettings.jsx  # Profile + password + security settings
│       │   ├── ScheduleMeetingModal.jsx # Meeting scheduler with Google Calendar toggle
│       │   ├── MeetRedirect.jsx     # /meet/:code → /videomeet?code= redirect
│       │   └── TermsAndConditions.jsx
│       ├── components/
│       │   ├── Lobby.jsx            # Pre-join camera/mic preview
│       │   ├── Controls.jsx         # In-call control bar (mic, cam, screen, chat, leave)
│       │   ├── ChatPanel.jsx        # In-meeting chat sidebar
│       │   ├── VideoGrid.jsx        # Responsive multi-participant video tile layout
│       │   ├── LocalVideo.jsx       # Picture-in-picture self-view overlay
│       │   ├── EmojiBar.jsx         # Emoji reaction picker
│       │   ├── EmojiOverlay.jsx     # Floating emoji animation renderer
│       │   ├── ProtectedRoute.jsx   # Auth guard wrapper
│       │   ├── auth/AuthPageShell.jsx # Shared auth page layout shell
│       │   ├── common/Skeleton.jsx  # Unified loading skeleton system
│       │   ├── common/Toast.jsx     # Notification toast
│       │   └── dashboard/           # StatCard, ActionCard, JoinMeetingModal
│       ├── hooks/
│       │   ├── useWebRTC.js         # WebRTC peer connection + offer/answer/ICE handling
│       │   ├── useMediaStream.js    # Camera/mic/screen lifecycle with cleanup
│       │   ├── useChat.js           # Chat message state + unread count
│       │   ├── useAuth.js           # Auth context consumer
│       │   ├── useSocket.js         # Socket context consumer
│       │   ├── useRateLimit.js      # Client-side form rate limiting
│       │   └── useTimedToast.js     # Auto-dismissing status toast
│       ├── contexts/
│       │   ├── AuthContext.jsx      # Auth state + actions provider
│       │   ├── AuthContextValue.js  # Context object (separated for React HMR)
│       │   └── SocketContext.jsx    # Socket.IO instance provider
│       ├── services/
│       │   ├── api.js               # All REST API call definitions
│       │   ├── apiClient.js         # Fetch wrapper with credentials + error handling
│       │   └── socket.service.js    # Socket.IO emit/listen helpers
│       ├── utils/
│       │   ├── validators.js        # Form validation (email, password strength, etc.)
│       │   ├── authStorage.js       # localStorage token/user cache
│       │   ├── mediaUtils.js        # Fallback silent stream creation
│       │   └── meetingUtils.js      # Meeting code extraction from URL
│       └── config/
│           └── webrtc.config.js     # STUN/TURN ICE server configuration
│
├── README.md
└── LICENSE
```

---

## ⚙️ Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB (Atlas or local instance)
- Redis (local, Railway, or Upstash)
- Google Cloud Console project with **Calendar API** and **OAuth 2.0** enabled

### Clone & Install

```bash
git clone https://github.com/Joel112003/MeetConnect.git
cd MeetConnect

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

## 🔐 Environment Variables

### `backend/.env`

```env
# ── Server ──
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
TRUST_PROXY=false

# ── Database ──
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/meetconnect

# ── JWT ──
JWT_SECRET=your-super-secret-key-min-32-chars

# ── Google OAuth (Calendar) ──
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/meetings/google/callback

# ── Google Calendar Token Encryption ──
GOOGLE_TOKEN_ENCRYPTION_KEY=64-char-hex-string   # openssl rand -hex 32

# ── Email (Nodemailer / Gmail App Password) ──
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# ── Redis ──
REDIS_URL=redis://localhost:6379
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🚀 Running Locally

```bash
# Terminal 1 — Backend (hot-reload)
cd backend
npm run dev

# Terminal 2 — Frontend (Vite dev server on :5173)
cd frontend
npm run dev
```

### Production

```bash
# Backend
cd backend
npm start          # node server.js
# or
npm run prod       # PM2 process manager

# Frontend
cd frontend
npm run build      # outputs dist/
npm run preview    # preview the production build
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/users/register` | ❌ | Register new user |
| POST | `/api/v1/users/login` | ❌ | Email/password login |
| POST | `/api/v1/users/google-login` | ❌ | Google OAuth login |
| POST | `/api/v1/users/logout` | ✅ | Logout (clear cookie) |
| POST | `/api/v1/users/forgot-password` | ❌ | Request OTP via email |
| POST | `/api/v1/users/verify-reset-otp` | ❌ | Verify OTP code |
| POST | `/api/v1/users/reset-password` | ❌ | Reset password with verified OTP |
| GET  | `/api/v1/users/username-available` | ❌ | Check username availability |

### Account
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET  | `/api/v1/users/me` | ✅ | Get current user profile |
| PUT  | `/api/v1/users/update-profile` | ✅ | Update username/email |
| PUT  | `/api/v1/users/change-password` | ✅ | Change password |
| POST | `/api/v1/users/logout-all-devices` | ✅ | Invalidate all sessions (token versioning) |

### Meeting History
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET  | `/api/v1/users/history` | ✅ | Get past meeting history |
| POST | `/api/v1/users/history` | ✅ | Add meeting to history |

### Meetings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST   | `/api/v1/meetings/create-room` | ✅ | Create instant meeting room (registers in Redis) |
| GET    | `/api/v1/meetings/validate/:code` | ✅ | Validate meeting code (Redis + DB) |
| POST   | `/api/v1/meetings/schedule` | ✅ | Schedule a future meeting |
| GET    | `/api/v1/meetings` | ✅ | List all scheduled meetings |
| PUT    | `/api/v1/meetings/:id` | ✅ | Update scheduled meeting |
| DELETE | `/api/v1/meetings/:id` | ✅ | Delete meeting |
| PATCH  | `/api/v1/meetings/:id/complete` | ✅ | Mark as completed or cancelled |
| POST   | `/api/v1/meetings/add-to-calendar` | ✅ | Add existing meeting to Google Calendar |

### Google Calendar
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/meetings/google/connect-token` | ✅ Cookie | Issues a 90s popup token to bypass cross-origin cookie restrictions |
| GET | `/api/v1/meetings/google/connect` | ✅ `?t=` token | Starts the Google OAuth consent flow (popup) |
| GET | `/api/v1/meetings/google/callback` | ❌ | Google OAuth redirect callback |
| GET | `/api/v1/meetings/google/status` | ✅ Cookie | Check if Google Calendar is connected |

> **Note on Google Calendar connect flow:** Due to cross-origin cookie restrictions in modern browsers (especially Brave), the connect flow uses a two-step approach. The frontend first calls `/connect-token` (cookie auth works here) to receive a short-lived JWT, then opens the popup with `?t=<token>` appended — bypassing any browser cookie blocking.

---

## 🔌 Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-call` | Client → Server | Join a meeting room (validates registration) |
| `user-joined` | Server → Client | Broadcast when a participant joins (includes full participants list) |
| `user-left` | Server → Client | Broadcast when a participant disconnects |
| `signal` | Bidirectional | WebRTC offer/answer/ICE candidate relay |
| `chat-message` | Bidirectional | Send/receive in-meeting chat messages (persisted to Redis) |
| `send-emoji` | Client → Server | Broadcast an emoji reaction to the room |
| `receive-emoji` | Server → Client | Receive emoji reaction from another participant |
| `join-error` | Server → Client | Room not found or validation failure |

---

## 🗄️ Database Indexes

Indexes are defined at the model level for all hot query paths:

| Model | Index | Purpose |
|-------|-------|---------|
| `User` | `email` (unique) | Login, password reset lookups |
| `User` | `username` (unique) | Registration + availability checks |
| `User` | `googleId` (unique, sparse) | Google OAuth login |
| `User` | `{ email, resetPasswordOtpExpiresAt }` (sparse) | OTP verification queries |
| `User` | `{ username }` with collation strength 2 | Case-insensitive username availability |
| `Meeting` | `{ user_id: 1, date: -1 }` | History list sorted by most recent |
| `ScheduledMeeting` | `{ user_id: 1, startTime: 1 }` | Upcoming meetings for a user |
| `ScheduledMeeting` | `{ meetingCode }` with collation strength 2 | Case-insensitive code validation |
| `ScheduledMeeting` | `{ user_id: 1, _id: 1 }` | Ownership checks in update/delete/complete |
| `ScheduledMeeting` | `{ user_id: 1, status: 1, startTime: 1 }` | Status-filtered meeting lists |
| `OAuthCredential` | `{ userId: 1, provider: 1 }` (unique) | Token lookup per user per provider |

---

## 🔄 Application Flow

```
1. User visits / (Landing page)
2. Signs up or logs in → JWT stored in HTTP-only cookie + session in Redis
3. Redirected to /dashboard
   ├── View stats (total meetings, this week, last meeting)
   ├── Start instant meeting → 6-char code generated → registered in Redis → lobby
   ├── Schedule meeting → saved to MongoDB + optional Google Calendar event created
   └── Join with code → validated (Redis first, then DB) → lobby
4. Lobby → camera/mic preview → click "Join now"
5. Video Meeting room (/videomeet?code=...)
   ├── Socket.IO join-call event emitted
   ├── WebRTC mesh: offer/answer/ICE via socket signaling
   ├── In-meeting chat (messages persisted to Redis, replayed on join)
   ├── Emoji reactions (broadcast as socket events, rendered as overlays)
   └── Leave → close all peer connections, stop media tracks, disconnect socket
6. Meeting code added to history automatically on join
```

---

## 🔮 Planned / Future Improvements

- [ ] **Waiting room / host approval queue** — guests wait for host to admit them
- [ ] Meeting recording (MediaRecorder API → cloud storage)
- [ ] Virtual backgrounds (TensorFlow.js BodyPix)
- [ ] Breakout rooms
- [ ] End-to-end encryption (E2EE) for media tracks
- [ ] Mobile app (React Native)
- [ ] File sharing in chat
- [ ] Meeting analytics dashboard
- [ ] SSO integration (SAML / OIDC)

---

## 🚢 Deployment (Render)

Both services are deployed on [Render](https://render.com):

- **Backend** — Web Service (Node.js), set `TRUST_PROXY=true`
- **Frontend** — Static Site, build command: `npm run build`, publish dir: `dist`

Make sure to set all environment variables in the Render dashboard. Set `GOOGLE_REDIRECT_URI` to your production backend URL:
```
https://your-backend.onrender.com/api/v1/meetings/google/callback
```

And add the same URI to your **Google Cloud Console → OAuth 2.0 → Authorized redirect URIs**.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
