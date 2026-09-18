# 🏋️ Fitness Tracker

A modern full-stack web application designed to help users track workouts, manage fitness progress, and maintain health routines. Built with the **MERN** stack (MongoDB, Express, React, Node.js).

---

## 🚀 Features

- **User Authentication**: Secure user registration, login, and logout.
- **JWT & HTTP-Only Cookies**: Protected routes and session management with token blacklisting.
- **Password Security**: Passwords hashed securely with bcrypt.
- **Client-Side Routing**: Fast page transitions using React Router with protected route wrappers.
- **Modern UI Styling**: Custom responsive interfaces styled with SCSS and CSS modules.
- **RESTful API**: Clean controller-route architecture with Express.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router
- **Styling**: SCSS / Vanilla CSS
- **HTTP Client**: Axios (with credentials / cookie support)

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (jsonwebtoken), bcryptjs, cookie-parser
- **Development**: Nodemon

---

## 📁 Project Structure

```
Fitness_Tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration (MongoDB connection)
│   │   ├── controller/      # Route controllers (Auth, logic)
│   │   ├── middlewares/     # Authentication & request middlewares
│   │   ├── models/          # Mongoose schemas (User, Blacklist)
│   │   ├── routes/          # API route definitions
│   │   └── app.js           # Express app setup and middleware configuration
│   ├── .env.example         # Template for environment variables
│   ├── package.json
│   └── server.js            # Entry point for backend server
│
├── frontend/
│   ├── public/              # Static assets (logos, icons)
│   ├── src/
│   │   ├── features/        # Feature-based modular architecture
│   │   │   ├── auth/        # Auth pages, context, hooks, and components
│   │   │   └── workout/     # Workout tracking pages and components
│   │   ├── styles/          # Global and modular SCSS stylesheets
│   │   ├── App.jsx
│   │   ├── app.routes.jsx   # Client-side route declarations
│   │   └── main.jsx         # React application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js       # Vite configuration
│
├── .gitignore               # Root git ignore file
└── README.md                # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd Fitness_Tracker
```

---

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in user & receive auth cookie | No |
| `GET` | `/api/auth/logout` | Invalidate token and log out | No |
| `GET` | `/api/auth/get-me` | Retrieve authenticated user profile | Yes |

---

## 🔒 Security Best Practices

- **Never commit `.env` files**: Real credentials and secret keys must stay on your local machine or in environment variable settings of your deployment provider.
- Keep your JWT secrets strong and rotate database credentials regularly.

---

## 📝 License

This project is licensed under the ISC License.
