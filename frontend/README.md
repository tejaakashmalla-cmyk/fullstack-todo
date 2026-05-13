# ✦ TaskFlow — Full Stack Todo App

A modern full-stack todo application built with React, Node.js, Express, and MongoDB Atlas.

---

## 📁 Folder Structure

```
project/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, getMe
│   │   └── taskController.js      # CRUD for tasks
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect middleware
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt hashed)
│   │   └── Task.js                # Task schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── TaskCard.js
│   │   │   └── TaskModal.js
│   │   ├── context/
│   │   │   └── AuthContext.js     # Context API + JWT
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + services
│   │   ├── App.js                 # Routes setup
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone & Setup MongoDB Atlas

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free account
2. Create a free M0 cluster
3. **Database Access** → Add user with username + password
4. **Network Access** → Add IP `0.0.0.0/0` (allow all, for dev)
5. **Connect** → Connect your app → Copy the connection string

---

### 2. Backend Setup

```bash
cd project/backend
npm install
```

Edit `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tododb?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_make_it_long_and_random
NODE_ENV=development
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

✅ You should see:
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

### 3. Frontend Setup

```bash
cd project/frontend
npm install
```

Create a `.env` file in the frontend folder:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Endpoints

### Auth Routes

| Method | Endpoint              | Body                          | Auth     |
|--------|-----------------------|-------------------------------|----------|
| POST   | /api/auth/register    | `{name, email, password}`     | Public   |
| POST   | /api/auth/login       | `{email, password}`           | Public   |
| GET    | /api/auth/me          | —                             | 🔒 JWT  |

### Task Routes (all protected)

| Method | Endpoint          | Body                                      | Auth    |
|--------|-------------------|-------------------------------------------|---------|
| GET    | /api/tasks        | —                                         | 🔒 JWT |
| POST   | /api/tasks        | `{title, description?, priority?}`        | 🔒 JWT |
| PUT    | /api/tasks/:id    | `{title?, description?, priority?, completed?}` | 🔒 JWT |
| DELETE | /api/tasks/:id    | —                                         | 🔒 JWT |

---

## 🧪 Testing with Thunder Client (VS Code)

Install the **Thunder Client** extension in VS Code.

### Test Register
- **POST** `http://localhost:5000/api/auth/register`
- Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Test Login
- **POST** `http://localhost:5000/api/auth/login`
- Body (JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Copy the `token` from the response.

### Test Create Task
- **POST** `http://localhost:5000/api/tasks`
- Header: `Authorization: Bearer YOUR_TOKEN_HERE`
- Body (JSON):
```json
{
  "title": "My first task",
  "description": "Testing the API",
  "priority": "high"
}
```

### Test Get All Tasks
- **GET** `http://localhost:5000/api/tasks`
- Header: `Authorization: Bearer YOUR_TOKEN_HERE`

### Test Update Task
- **PUT** `http://localhost:5000/api/tasks/TASK_ID`
- Header: `Authorization: Bearer YOUR_TOKEN_HERE`
- Body:
```json
{
  "completed": true
}
```

### Test Delete Task
- **DELETE** `http://localhost:5000/api/tasks/TASK_ID`
- Header: `Authorization: Bearer YOUR_TOKEN_HERE`

---

## 🚀 Deployment

### Backend → Render

1. Push your `backend/` folder to a GitHub repository
2. Go to [https://render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = production
   - `FRONTEND_URL` = your Vercel/Netlify frontend URL
6. Deploy → Copy the Render URL (e.g. `https://your-app.onrender.com`)

---

### Frontend → Vercel

1. Push your `frontend/` folder to a GitHub repository
2. Go to [https://vercel.com](https://vercel.com) → New Project
3. Import your repo → **Root Directory**: `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL` = your Render backend URL
5. Deploy ✅

#### Alternative: Netlify

1. `cd frontend && npm run build`
2. Go to [https://netlify.com](https://netlify.com) → Drag & drop the `build/` folder
3. Or connect GitHub → Set build command: `npm run build`, publish dir: `build`
4. Add env variable: `REACT_APP_API_URL` = Render URL

---

## 🔒 JWT Flow

```
User Registers/Logs in
        ↓
Server returns JWT token
        ↓
Frontend stores token in localStorage
        ↓
Axios interceptor attaches token to every request
Authorization: Bearer <token>
        ↓
Backend verifies token → grants access
        ↓
On logout → token removed from localStorage
```

---

## 🛠 Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React 18, React Router 6 |
| State     | Context API + useState   |
| HTTP      | Axios with interceptors  |
| Backend   | Node.js + Express.js     |
| Database  | MongoDB Atlas + Mongoose |
| Auth      | JWT + bcryptjs           |
| Styling   | Pure CSS (no framework)  |
| Deploy    | Render (BE) + Vercel (FE)|

---

## 📦 npm Install Commands Summary

```bash
# Backend
cd backend
npm install express mongoose dotenv cors bcryptjs jsonwebtoken nodemon

# Frontend
cd frontend
npm install react react-dom react-router-dom axios react-scripts
```

---

## 🐛 Common Issues

**CORS error**: Make sure `FRONTEND_URL` is set correctly in production `.env`

**MongoDB connection fails**: Check Network Access in Atlas → Add `0.0.0.0/0`

**JWT invalid**: Make sure `JWT_SECRET` matches between login and verification

**Blank page on Vercel**: Add a `vercel.json` in frontend root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Blank page on Netlify**: Create `frontend/public/_redirects`:
```
/* /index.html 200
```
