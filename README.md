# Microtutoring Webapp

## Table of Contents

- Overview
- Key Features
- Live Demo
- Tech Stack
- Architecture Overview
- Project Structure
- Routes and Access Control
- Installation and Setup
- Environment Variables
- How to Run Locally
- Database and Data Model

## Overview

QuickTutor is a web-based micro-tutoring platform that provides instant academic support through real-time student-tutor interaction. Students can request help, chat live, track sessions, and manage wallet activity, while tutors can accept requests, teach online, monitor earnings, and review session performance.

## Key Features

- Student and tutor signup/login flows with JWT-based authentication
- Role-based dashboards for students and tutors
- Real-time tutor online/offline status tracking
- Student question submission to tutors
- Tutor request acceptance flow with session creation
- Real-time tutoring session lifecycle using Socket.IO
- Live chat room for active tutoring sessions
- Collaborative whiteboard for shared teaching and problem-solving during sessions
- Wallet balance and recharge management for students
- Tutor earnings and payment history tracking
- Favorite tutor functionality
- Profile setup and settings management for both roles
- Password update support
- Review and rating support for tutors
- Session metadata and whiteboard state persistence for continued tutoring workflows

## Live Demo


## Tech Stack

### Frontend
- React 19
- TypeScript
- React Router DOM
- Tailwind CSS
- Socket.IO Client
- Axios

### Backend
- Node.js
- Express 5
- TypeScript
- Socket.IO
- MongoDB with Mongoose
- JWT for auth
- Cloudinary for file uploads
- Multer for multipart uploads
- BcryptJS for password hashing

## Architecture Overview

The application follows a simple client-server architecture:

- Client (React + Vite): handles dashboards, signup/login, pages, notifications, chat UI, and user interactions
- API Server (Express): manages authentication, profile and user operations, session logic, reviews, wallet actions, and question handling
- MongoDB: stores users, tutoring sessions, questions, reviews, earnings, and recharge information
- Socket.IO: powers real-time online status, incoming question requests, session events, and live updates

A typical service flow looks like this:

1. User logs in and receives an authenticated session cookie
2. Frontend requests user info, dashboard data, and protected resources
3. Backend validates JWT and enforces role access rules
4. Real-time tutoring events are emitted via Socket.IO
5. MongoDB stores the persistent application data

## Project Structure

```text
microtutoring-webapp/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── chatComponents/
│   │   │   ├── homepageComponents/
│   │   │   ├── studentDashboardComponents/
│   │   │   └── tutorDashboardComponents/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── dashboardPages/
│   │   │   └── signupPages/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── socket.ts
│   ├── app.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── README.md
└── package.json
```

## Routes and Access Control

### Frontend routes

- `/` — Landing page / homepage
- `/signup` — Signup flow for new users
- `/login` — Login page
- `/studentDashboard` — Student dashboard with wallet, history, favorites, and settings
- `/tutorDashboard` — Tutor dashboard with earnings, reviews, requests, and settings
- `/chatroom/:sessionId` — Live session chat room

### Backend API routes

#### Authentication
- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login a user
- `POST /api/auth/logout` — logout and clear cookie
- `GET /api/auth/is-authenticated` — check auth status
- `GET /api/auth/profile` — get authenticated user profile
- `POST /api/auth/setup-profile` — set up profile information for student/tutor

#### User / Profile
- `GET /api/user/data` — get current user data
- `GET /api/user/favorites` — fetch saved favorite tutors
- `POST /api/user/favorites/:tutorId` — toggle favorite tutor
- `GET /api/user/online-tutors` — get online tutors by subject
- `PUT /api/user/profile` — update a tutor or student profile
- `PUT /api/user/password` — change user password
- `PUT /api/user/bank-details` — update bank details
- `DELETE /api/user/account` — delete account and related records

#### Questions / Sessions
- `POST /api/question/askQuestion` — student asks a tutoring question
- `GET /api/session/:sessionId` — fetch session by ID
- `GET /api/session/:sessionId/messages` — fetch chat messages for a session
- `GET /api/session/student/:studentId/history` — get student history
- `GET /api/session/tutor/:tutorId/history` — get tutor history
- `GET /api/session/count/me` — get session count for authenticated user

#### Reviews
- `POST /api/reviews` — create a tutor review
- `GET /api/reviews/tutor/:tutorId` — get tutor ratings and review summary

#### Recharge / Earnings
- `/api/recharge` — recharge wallet and related flow
- `/api/earnings` — earnings tracking and reporting

### Access control

The backend uses `userAuth` middleware to protect routes that require an authenticated user. Most user, session, question, and review actions require a valid JWT in the cookie. Role-based logic is enforced in controllers and socket handlers to ensure only the correct user type can access certain features.

## Installation and Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance or MongoDB Atlas connection string
- Cloudinary account for media uploads (if profile/question images are used)

### 1. Clone the repository

```bash
git clone <repository-url>
cd microtutoring-webapp
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder with the following variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
JWT_SECRET=your_secret_key_here
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## How to Run Locally

### Start the backend

```bash
cd server
npm run server
```

The backend listens on port `4000` by default.

### Start the frontend

```bash
cd client
npm run dev
```

The frontend typically runs on:

```text
http://localhost:5173
```

### Production build

```bash
cd client
npm run build
```

## Database and Data Model

The backend uses MongoDB with Mongoose models for the core entities.

### User model
Stores:
- `firstName`
- `lastName`
- `email`
- `password`
- `role` (`student` or `tutor`)
- `isOnline`
- nested `student` and `tutor` profiles

### Student profile
Includes:
- grade
- curriculum
- gender
- institution/school
- profile picture
- balance
- favorite tutors
- saved card data
- bank details

### Tutor profile
Includes:
- qualification
- experience
- subjects
- bio
- profile picture
- earnings
- bank details

### Question model
Stores:
- `userId`
- `subject`
- `topic`
- `question`
- `image`
- timestamps

### Session model
Stores:
- `sessionId`
- `tutorId`
- `studentId`
- `questionId`
- `subject`
- `question`
- status (`Pending`, `Active`, `Completed`, `Expired`)
- timestamps and optional whiteboard session data

### Review model
Stores:
- `studentId`
- `tutorId`
- `rating`
- optional `reviewText`
- timestamp

## Summary

QuickTutor is a full-stack micro-tutoring platform that combines student/tutor onboarding, live session management, wallet workflows, dashboards, and real-time communication into a single connected application. It is designed to support practical online tutoring interactions in an intuitive and role-aware interface.
