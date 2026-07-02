# 🎬 Short-Form Video Creator Platform

A modern, mobile-first short-form video sharing platform inspired by the clean, immersive aesthetics of TikTok and Instagram Web. Built with React (Vite), Tailwind CSS, and React Router, featuring a premium glassmorphic dark-mode interface (`#0F172A`), fluid swipe-snapping feeds, and adaptive structural navigation layouts.

---

## ✨ Features

### 📱 Immersive Video Feed
* **Scroll Snapping:** Native CSS vertical snapping mechanics (`snap-y snap-mandatory`) that cleanly lock videos into full viewport focus on mobile touch gestures.
* **Desktop Deck Framework:** Automatically re-aligns from full-screen mobile viewports to a centered, responsive deck configuration for desktop monitors.

### 🧭 Hybrid Structural Navigation
* **Adaptive NavBar/Sidebar:** Automatically transforms from an Instagram-style fixed vertical sidebar on desktops to a space-saving bottom navigation bar on mobile viewports.
* **Sleek Interface Scrollbars:** Custom webkit scrollbars designed to perfectly blend into the background palette, eliminating standard browser elements.

### 👥 Creator Ecosystem
* **3-Column Portfolio Matrix:** A specialized creator grid profile gallery with hidden overlay states showcasing metadata metrics like captions and engagement totals.
* **Sleek Discovery Feed:** Responsive inline row tracking that easily collapses for intuitive creator follow/unfollow operations.

### 🔐 Secure Authentication Gates
* **Protected App Tracks:** Router-level interception guards (`ProtectedRoute`) that catch unauthenticated routing requests and redirect traffic to access ports.
* **Double-Submission Prevention:** Component-level loading locks designed to handle request tracking states and protect database endpoints.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS, React Router v6
* **Icons:** React Icons (`fa` / `lu` sets)
* **Backend Integration:** RESTful Multipart FormData API

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
2. Install Dependencies
Bash
npm install
3. Configure Environment Variables
Create a .env file in the root directory of your project and configure your backend endpoint address:

Code-Snippet
VITE_API_BASE_URL=http://localhost:3000
4. Boot Up the Development Server
Bash
npm run dev
Open your browser to the local address displayed in your terminal (typically http://localhost:5173).

📂 Project Structure
Plaintext
src/
├── components/
│   ├── NavBar.jsx        # Dual desktop sidebar / mobile bottom bar
│   └── VideoCard.jsx     # Responsive video wrapper with layout controls
├── pages/
│   ├── Home.jsx          # Vertical swipe feed container
│   ├── Following.jsx     # Discovery lists & creator connections
│   ├── Profile.jsx       # 3-column media grid portfolio view
│   ├── Login.jsx         # Glassmorphism auth panel with protection gates
│   └── Signup.jsx        # Multipart form view with dynamic avatar uploads
├── App.jsx               # Protected route tree management
├── index.css             # Tailwind base & global dark scrollbar aesthetics
└── main.jsx              # Virtual DOM renderer mount point



Website: https://fliptok.netlify.app/
