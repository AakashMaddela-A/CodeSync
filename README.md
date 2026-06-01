# CodeSync

**Collaborate. Code. Build Together.**

A production-style MERN stack real-time collaborative code editor with JWT authentication, Socket.IO, Monaco Editor, and Judge0 code execution.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Monaco Editor, Socket.IO Client
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO
- **Database:** MongoDB (local)

## Prerequisites

- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

## Installation

**One-time setup (from project root):**

```bash
npm run install:all
```

Or install separately:

```bash
cd backend && npm install
cd frontend && npm install
```

Copy `.env.example` to `.env` in both `backend/` and `frontend/` (already configured for local MongoDB).

## Run

**Single command (backend + frontend together):**

```bash
npm run dev
```

From the project root in VS Code terminal. Uses `concurrently` to run both servers.

- **API:** http://localhost:5000  
- **App:** http://localhost:5173  

**Or run separately:**

```bash
npm run backend   # backend only
npm run frontend  # frontend only
```

## Features

- JWT Authentication (Register / Login / Logout)
- Create & Join collaborative rooms
- Real-time code sync via Socket.IO
- Online participants list & typing indicator
- Real-time chat with MongoDB persistence
- Monaco Editor (JavaScript & Java)
- Code execution via Judge0 API
- Save / manage projects
- Responsive UI with Tailwind CSS

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| POST | /api/rooms/create | Create room |
| POST | /api/rooms/join | Join room |
| GET | /api/rooms/:roomId | Get room details |
| POST | /api/projects | Save project |
| GET | /api/projects | List projects |
| GET | /api/projects/:id | Get project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| POST | /api/code/run | Execute code |

## MongoDB URI

```
mongodb://127.0.0.1:27017/codesync
```
