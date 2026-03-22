# Akhara Gym Management System

A production-ready Gym Management System with a React frontend and Node.js/Express backend, used by my local gym to manage and track their memberships

## 🚀 GitHub Setup

To push this code to your GitHub:

1. Create a **new empty repository** on GitHub.
2. Open your terminal in the root folder (`GymManagement`) and run:
   ```bash
   git add .
   git commit -m "Initial commit: Production ready"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## 🌐 Deployment Instructions

### 1. Backend (Render / Heroku)
- **Repo**: Connect your GitHub repo.
- **Root Directory**: `gym-backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Env Variables**:
  - `PORT`: `5000` (or leave default)
  - `MONGODB_URI`: Your MongoDB Atlas connection string.

### 2. Frontend (Vercel / Netlify)
- **Repo**: Connect your GitHub repo.
- **Root Directory**: `gym-frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Env Variables**:
  - `VITE_API_URL`: `https://gym-management-opnz.onrender.com/api`

## 🛠️ Tech Stack
- **Frontend**: React, TailwindCSS, Axios
- **Backend**: Node.js, Express, MongoDB/Mongoose
- **Features**: Dashboard Stats, Member Management, WhatsApp Reminders, 10-min Auto-Lock.
