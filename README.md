# Hospital Management System - Frontend

This is the frontend application for the Hospital Management System, built with React, TypeScript, and Vite.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Auth/       # Authentication components
│   │   ├── Layout/     # Layout components (Navbar, Sidebar)
│   │   └── UI/         # Basic UI components (Button, Input, etc.)
│   ├── contexts/       # React Context providers
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions and constants
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### Running from Root Directory

You can also use the batch files from the project root:

- **Frontend only**: `run-frontend.bat`
- **Full stack**: `run-all.bat`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- **Authentication**: Login and registration with JWT tokens
- **Dashboard**: Overview of hospital statistics
- **Patient Management**: View and manage patient records
- **Appointments**: Schedule and manage appointments
- **Prescriptions**: Create and view prescriptions
- **Responsive Design**: Works on desktop and mobile devices

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`. Make sure the backend is running before using the frontend.

API configuration can be found in `src/services/api.ts`.

## Environment Variables

Create a `.env` file in the frontend directory if you need to customize:

```
VITE_API_URL=http://localhost:8000
```









