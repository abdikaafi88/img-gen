Image Generator is a full-stack mobile application built using the MERN stack (MongoDB, Express, React Native, Node.js).
The application allows users to sign up, sign in, generate/search images using a third-party AI API, view results, and manage their personal image history.

This project is designed to meet all university final-project requirements, including secure authentication, clean architecture, full-stack integration, modern UI styling, and third-party API usage.

🎯 Objectives

Build a complete full-stack mobile app

Demonstrate mastery of:

MongoDB (Database)

Express & Node.js (Backend)

React Native (Frontend)

NativeWind (UI styling)

Implement:

Secure authentication (JWT)

Third-party API integration

Persistent data storage

Clean, modular project architecture

🧱 Tech Stack
Frontend (Mobile App)

React Native (Expo)

NativeWind (Tailwind CSS for React Native)

Axios

AsyncStorage

React Navigation

Backend (Server API)

Node.js

Express.js

MongoDB + Mongoose

JSON Web Token (JWT)

bcryptjs

dotenv

CORS

Third-Party API

AI Image Generation API (e.g., OpenAI / OpenRouter / Stability)

📁 Project Folder Structure
IMAGE-GENERATOR
│
├── backend
│   ├── config        # Database & API configurations
│   ├── controllers  # Business logic
│   ├── middleware   # Auth & route protection
│   ├── models       # MongoDB schemas
│   ├── routes       # API endpoints
│   ├── .env         # Secrets (ignored by git)
│   ├── server.js    # Backend entry point
│   └── package.json
│
├── assets           # Images, icons, fonts
├── context          # Global state (Auth, Images)
├── screens
│   ├── imageScreen.js
│   ├── searchScreen.js
│   ├── historyScreen.js
│   └── auth screens
│
├── App.js
├── index.js
├── app.json
└── package.json


Architecture flow:

Mobile App → Routes → Middleware → Controllers → Models → MongoDB

✨ Core Features
🔐 Authentication & Security

User registration and login

Password hashing (bcrypt)

JWT token generation

Token storage using AsyncStorage

Auto-login

Protected backend routes

Environment variables in .env

🖼️ Image Generation & Search

Prompt input

Secure API call via backend

Third-party image generation

Real-time image display

🕘 History Management

Save generated images per user

Fetch user-specific history

Delete history items

Persistent database storage

🎨 UI & Styling

NativeWind (Tailwind utilities)

Responsive layouts

Clean modern UI

Loading states and error handling

🔄 Full-Stack Data Flow

User logs in (React Native)

Token stored in AsyncStorage

User submits prompt

App sends request to Express API

Backend:

verifies JWT

calls third-party API

saves result in MongoDB

Backend returns data to mobile app

App displays image and stores history

🗄️ Database Models
User

name

email

password (hashed)

createdAt

Image

userId (reference)

prompt

imageUrl

createdAt

🔌 API Structure
Auth Routes
POST   /api/auth/register
POST   /api/auth/login

Image Routes (Protected)
POST   /api/images/generate
GET    /api/images/history
DELETE /api/images/:id

⚙️ Environment Variables

Create a .env file inside /backend:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
AI_API_KEY=your_api_key


⚠️ Never upload .env to GitHub.

▶️ Running the Project
Backend
cd backend
npm install
npm run dev

Frontend
npm install
npx expo start

🧪 Live Defense Readiness

The project is structured to allow:

Easy UI modifications

Simple form updates

Clear API flow explanation

Fast debugging

Quick feature additions

All code is modular, commented, and easy to demonstrate.

📚 Learning Outcomes

MERN full-stack development

Secure mobile authentication

Backend API design

MongoDB data modeling

Third-party API integration

Clean architecture principles

Mobile UI engineering

🏁 Conclusion

This Image Generator application demonstrates professional-level full-stack development with modern mobile practices, secure architecture, clean UI design, and real-world API integration.

It fully satisfies all academic project requirements and is prepared for live defense and evaluation."# image-generator77" 
# image-generator77
# image-generator77
# image-generator77
# image-generator77
