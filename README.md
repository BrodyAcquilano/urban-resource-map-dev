# Urban Resource Map

A full-stack web app for mapping urban resources like water fountains, food banks, libraries, and more.

Built with:

- React + Vite (frontend)
- Express + MongoDB (backend)
- Leaflet for interactive maps

---

## 🔧 Setup Instructions

1. **Clone the repository**
2. **Install dependencies** by running:
   npm install

3. **Create a `.env` file** in the project root folder with your MongoDB connection string:

   MONGO_URI=mongodb+srv://<yourUser>:<yourPassword>@yourcluster.mongodb.net/

   > 🔐 Do not commit your `.env` file — it is ignored by `.gitignore`.

4. **Start the development servers**:
   npm run dev

---

## 🚀 Running the Project Locally

The project includes both a frontend and a backend. When you run:

npm run dev

It will:

- Start the **backend API server** on http://localhost:3000
- Start the **frontend app** on http://localhost:5173

You can then interact with the API from your frontend (e.g., fetching or posting location data).

---

## 🧩 Development Proxy (Vite → Express)

During development, Vite is configured to proxy API requests to the backend server.

This allows you to use relative paths in your frontend code like:

fetch('/api/locations')

instead of hardcoding:

fetch('http://localhost:3000/api/locations')

---

## 📦 Available Scripts

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| npm run dev          | Runs both frontend and backend concurrently |
| npm run start-client | Runs only the Vite frontend                 |
| npm run start-server | Runs only the Express backend (via nodemon) |

---

## 🧪 Environment Variables

Create a `.env` file at the root of the project with this line:

MONGO_URI=your-mongodb-connection-string-here

---

## 🧱 Tech Stack

- **Frontend**: React, Vite, Leaflet, React-Leaflet
- **Backend**: Express, Node.js
- **Database**: MongoDB Atlas (cloud-hosted)

---
