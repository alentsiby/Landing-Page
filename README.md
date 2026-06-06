# Neuraxis Landing Page

An enterprise-grade, high-performance, responsive landing page with a cyberpunk/cyborg theme for **Neuraxis**, a futuristic Brain-Computer Interface (BCI) technology company. 

The site features rich interactive components, modern animations, a sleek dark mode design system, and a live system telemetry console.

---

## 🚀 Features

- **Morphing Reticle Custom Cursor**: A custom-drawn spring-smoothed mouse cursor that dynamically scales and changes state (default, hover, scanning) depending on the hover target.
- **3D Parallax Tilt Cards**: Hover-responsive cards showcasing implants with dynamic coordinate rotation (using Framer Motion).
- **Interactive System Terminal**: A simulated Command-Line Interface (CLI) that accepts terminal commands:
  - `help` — List available commands.
  - `status` — Check bio-metrics, core temperature, and system latency.
  - `/contact` — Routes communications protocol.
  - `/subscribe` — Triggers the priority access waitlist form.
  - `clear` — Clears terminal history.
- **Live System Telemetry**: Dynamic dashboard tracking mock Neural Load, Core Temp, and Biosync Rate, with active animations.
- **Biometric Waitlist Portal**: A secure modal interface that allows users to submit waitlist applications.

---

## 🛠️ Technology Stack

- **Framework**: React (V18+)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4.0
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Orbitron & Inter (Google Fonts)

---

## 📂 Project Directory Structure

```text
Landing-Page/
├── dist/                  # Production build output
├── node_modules/          # Installed dependencies
├── src/
│   ├── index.css          # Tailwind CSS global entry and design system
│   └── main.jsx           # React app entry point
├── index.html             # Entry HTML page
├── LandingPage.jsx        # Main Landing Page React component
├── package.json           # Project metadata & npm dependencies
├── vite.config.js         # Vite configuration (React + Tailwind plugins)
└── .gitignore             # Ignored directories/files in Git
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18.x or higher recommended).

### 2. Install Dependencies
Navigate to the directory and run:
```bash
npm install
```

### 3. Start Development Server
Launch the local development environment:
```bash
npm run dev
```
Open your browser and navigate to the local server URL provided (usually `http://localhost:5173`).

### 4. Build for Production
Bundle and optimize the app for production:
```bash
npm run build
```

---

## 📁 Git Setup & Pushing Code

For full instructions and Git commands to commit these files individually and push them to your repository, please refer to the Git guide provided in the terminal output.
