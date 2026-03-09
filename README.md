# Students Table App

A full-featured React.js student management dashboard with CRUD operations, built with Vite.

## Features

- **Student List** — Name, Email, Age, and Edit/Delete actions
- **Add Student** — Form with full validation (required fields, valid email format)
- **Edit Student** — Pre-filled form with same validations
- **Delete Student** — Confirmation dialog before removal
- **Simulated Loading State** — 600ms animated progress bar on every action
- **Search / Filter** — Real-time filter by name or email
- **CSV Export** — Downloads currently filtered rows (or all students)
- **Toast Notifications** — Feedback for add, update, and delete actions
- **In-memory state** — No backend required; all data managed via React state

## Tech Stack

- React 18
- Vite 5
- Pure inline styles (no CSS framework dependency)
- Google Fonts (Syne + DM Mono)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Deployment

### Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects Vite — click **Deploy**

### Netlify

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy**

## Project Structure

```
students-app/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx       # React entry point
    ├── index.css      # Global reset
    └── App.jsx        # Main application component
```

## Optional: NestJS Backend Bonus

To implement the backend with NestJS + PostgreSQL, create a separate NestJS project with:

- `GET    /students`       — List all students
- `POST   /students`       — Create a student
- `PATCH  /students/:id`   — Update a student
- `DELETE /students/:id`   — Delete a student

Recommended packages: `@nestjs/typeorm`, `typeorm`, `pg`
