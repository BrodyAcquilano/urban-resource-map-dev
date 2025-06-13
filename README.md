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

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root folder with your MongoDB connection string:

   ```bash
   MONGO_URI=mongodb+srv://<yourUser>:<yourPassword>@yourcluster.mongodb.net/
   ```

   > 🔐 Do not commit your `.env` file — it is ignored by `.gitignore`.

4. **Start the development servers**:
   ```bash
   npm run dev
   ```

---

## 🚀 Running the Project Locally

The project includes both a frontend and a backend. When you run:

```bash
npm run dev
```

It will:

- Start the **backend API server** on http://localhost:3000
- Start the **frontend app** on http://localhost:5173

You can then interact with the API from your frontend (e.g., fetching or posting location data).

---

## 🧩 Development Proxy (Vite → Express)

During development, Vite is configured to proxy API requests to the backend server.

This allows you to use relative paths in your frontend code like:

```js
fetch("/api/locations");
```

instead of hardcoding:

```js
fetch("http://localhost:3000/api/locations");
```

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

```bash
MONGO_URI=your-mongodb-connection-string-here
```

---

## 🧱 Tech Stack

- **Frontend**: React, Vite, Leaflet, React-Leaflet, React Router DOM
- **Backend**: Express, Node.js
- **Database**: MongoDB Atlas (cloud-hosted)
- **Dev Tools**: Nodemon, Concurrently, ESLint

---

## 🧠 App Structure & Routing

The `App.jsx` file serves as the root of the application. It contains:

- Global UI components like the **Header**, **MapPanel**, and **FilterPanel**
- Route definitions for three main pages:
  - `/` → **Home Page**: View nearby resources
  - `/editor` → **Editor Page**: Add, edit, or delete location data
  - `/export` → **Export Page**: Generate and export maps as PDFs

These pages share global state (markers, filters, etc.) to avoid redundant reloads. Changing pages doesn’t reset filters or trigger new fetches unless needed.

---

## 🧩 Data Model Overview

The app’s dynamic behavior is driven by a centralized **data model** in `dataModel.js`, which defines:

- The **categories** of information (e.g. resources, services, comforts)
- The **default structure** of location objects (e.g. open hours, booleans, arrays)
- Shared constants (e.g. days of the week, label sets, validation helpers)

This file powers:

- ✅ UI rendering (checkboxes, labels, filters)
- ✅ Input validation
- ✅ Default state generation
- ✅ Output display logic (info panels, exports)
- ✅ Filter logic for map markers

By modifying the data model, developers can:

- Add new fields or categories (e.g., “First Aid” or “Charging Station”)
- Track seasonal or time-based exceptions
- Control which filters are shown
- Repurpose the app for other domains (e.g. medical clinics, public restrooms, climate shelters)

Changes to the label lists (like `resources` or `services`) automatically affect all relevant forms, filters, and displays — no manual updates needed across components.

---

## 🧭 Workflows and Use Cases

The app is structured around three key workflows:

### 🗺 Viewing Controls (Home Page)

Find free resources based on user-selected filters — without needing to search for businesses by name or category. This allows:

- Comparing services that match personal needs (rather than ads)
- Identifying high-resource zones (e.g. green for well-served areas, red for deserts)
- Overlaying transit or mobility routes between locations
- Adding seasonal or hourly resource awareness (e.g. warming centre in winter only)

### ✏️ Data Management (Editor Page)

Edit resource data manually or crowdsource input. Possible configurations:

- Open access (default)
- Admin-restricted access (via login logic, not yet implemented)
- Add, edit, or delete locations dynamically with live updates to the map

### 🖨 Export Tools (Export Page)

Generate PDF maps with filtered results for offline use or sharing with:

- Outreach teams
- People without phones or reliable connectivity
- Printed handouts for service providers

---

## 🔮 Future Improvements

- ✅ Add scoring logic to highlight strong/weak areas
- ✅ Add seasonal/time filters to track shifting availability
- ✅ Add user login or role-based permissions for editing
- ✅ Export full-page PDFs with custom map overlays
- ✅ Add import/export buttons for bulk JSON or CSV data

---

## 🌍 Use Cases

This app can be customized for:

- 🏙 City planning & public policy
- 🚶 Homeless outreach & mobile resource guides
- 🚲 Bicycle route + amenity mapping
- 🧭 Disaster response & emergency coordination
- 🌡 Heat/cold wave survival mapping
- 🧘‍♀️ Community wellness directories

Its modular data structure allows the same core system to support new applications by simply changing the data model and UI copy.
