# Student Management Dashboard (React + Vite)

## Project Overview

This project is a simple **Student Management Dashboard** built using **React.js and Vite**.
The application allows users to perform basic **CRUD operations** (Create, Read, Update, Delete) on student records.

The goal of this project was to practice **React fundamentals**, including component structure, state management, form validation, and UI interaction.

The project does not use a backend database. Instead, all student data is stored in **React's in-memory state**, which makes the application lightweight and easy to run locally.

This project was developed as a **practice project to demonstrate frontend development skills using React**.

---

# Features

### 1. Student List

The dashboard displays a table containing student information such as:

* Student Name
* Email Address
* Age
* Edit action
* Delete action

The table dynamically updates whenever a student is added, edited, or removed.

---

### 2. Add Student

Users can add a new student using a form.

The form includes validation rules such as:

* Name is required
* Email must follow a valid email format
* Age must be entered

Once the form is submitted successfully, the student is added to the list and a notification appears.

---

### 3. Edit Student

Each student row includes an **Edit button**.

When clicked:

* The form opens with **pre-filled student data**
* Users can modify the details
* After submitting, the table updates with the new values

This feature demonstrates how React can manage and update dynamic data.

---

### 4. Delete Student

Users can delete a student record from the table.

Before deleting:

* A confirmation dialog appears
* This prevents accidental deletion of records

Once confirmed, the student is removed from the list.

---

### 5. Simulated Loading State

To improve the user experience, the application includes a **600ms loading animation** for actions such as:

* Adding a student
* Updating a student
* Deleting a student

This simulates how a real application behaves when interacting with a backend server.

---

### 6. Search / Filter

The dashboard includes a **real-time search feature**.

Users can search students by:

* Name
* Email

The table automatically filters results as the user types.

---

### 7. CSV Export

Users can export student data as a **CSV file**.

The export feature downloads:

* All students, or
* Only the currently filtered students

This is useful for exporting data to spreadsheets.

---

### 8. Toast Notifications

The application provides user feedback using small notification messages (toasts) when:

* A student is added
* A student is updated
* A student is deleted

This helps users clearly understand the result of their actions.

---

# Tech Stack

The project was built using the following technologies:

* **React 18** – Frontend library used to build the UI
* **Vite 5** – Fast build tool for modern web applications
* **JavaScript (ES6+)**
* **Inline CSS Styles**
* **Google Fonts** – Syne and DM Mono

---

# Getting Started

## Prerequisites

Make sure you have the following installed:

* **Node.js (version 18 or above)**
* **npm or yarn**

You can check the version using:

```bash
node -v
```

---

# Installation

Clone the repository and install dependencies.

```bash
git clone https://github.com/your-username/students-app.git
cd students-app
npm install
```

---

# Running the Application

Start the development server:

```bash
npm run dev
```

After running the command, open your browser and go to:

```
http://localhost:5173
```

The application should now be running locally.

---

# Production Build

To create an optimized production build:

```bash
npm run build
```

The production files will be generated in the **dist/** folder.

---

# Deployment

## Deploy on Vercel

1. Push the project to GitHub
2. Go to **vercel.com**
3. Click **New Project**
4. Import your GitHub repository
5. Vercel automatically detects the Vite configuration
6. Click **Deploy**

---

## Deploy on Netlify

1. Push the project to GitHub
2. Go to **netlify.com**
3. Click **Add new site → Import from Git**
4. Select your repository

Use the following settings:

Build Command:

```
npm run build
```

Publish Directory:

```
dist
```

Then click **Deploy**.

---

# Project Structure

```
students-app/
│
├── index.html
├── vite.config.js
├── package.json
├── README.md
│
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx
```

### File Explanation

**index.html**

This file is the main HTML template where the React application is mounted.

---

**main.jsx**

This is the entry point of the React application.

It connects the React application to the HTML DOM using `ReactDOM.createRoot()`.

---

**App.jsx**

This file contains the **main application logic**, including:

* Student state management
* Form handling
* CRUD operations
* Search functionality
* CSV export logic

---

**index.css**

This file includes global styling and reset rules for consistent layout.

---

# Optional Backend Enhancement (NestJS)

Currently, this project uses **in-memory data**.

For a real-world application, a backend can be added using **NestJS with PostgreSQL**.

Example API structure:

```
GET    /students
POST   /students
PATCH  /students/:id
DELETE /students/:id
```

Recommended packages:

* `@nestjs/typeorm`
* `typeorm`
* `pg`

---

# Learning Outcomes

Through this project, the following concepts were practiced:

* React component architecture
* State management using `useState`
* Form validation
* CRUD operations
* Dynamic table updates
* Exporting data to CSV
* UI feedback with notifications
* Deploying a React application

---

# Conclusion

This project demonstrates how a simple **student management system** can be implemented using **React.js** without a backend.

It highlights the core frontend concepts required to build modern web applications and serves as a strong foundation for building more advanced full-stack applications in the future.
