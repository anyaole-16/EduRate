# 🎓 EduRate: University Course Evaluation System

**EduRate** is a modern, role-based academic portal designed for higher education institutions. It streamlines the course evaluation process, allowing students to provide comprehensive feedback on teaching methodology, classroom management, and institutional values, while providing administrators and lecturers with data-driven insights.

## 🏛 Project Vision

The system is built to mirror a high-end university student portal, focusing on a clean, structured, and professional user experience using **Academic Blue (#1e3a8a)** and **Gold** accents.

---

## 🚀 Key Features

### 🔐 Multi-Role Authentication

* **Admin:** Manage the academic registry (Create Students, Courses, and Lecturers).
* **Lecturer:** Access personal evaluation analytics and student feedback.
* **Student:** View registered courses by level and submit structured evaluations.

### 📊 Comprehensive Evaluation Engine

The evaluation form is divided into five critical academic dimensions:

1. **Teaching Methodology:** Presentation clarity, real-life application, and mastery of topics.
2. **Teacher’s Assessment Procedure:** Grading transparency, fairness, and feedback quality.
3. **Classroom Management:** Interpersonal respect and availability.
4. **Integration of Faith & Values:** (Institutional Mission) Spiritual engagement and personal integrity.
5. **Logistics:** Attendance and punctuality (20%–100% scale).
6. **Qualitative Feedback:** Open-ended "Likes" and "Dislikes" sections.

### 📈 Data Visualization

* **Lecturer Dashboard:** Visual charts representing performance metrics across different evaluation categories.
* **Admin Overview:** Table-based management with clean, striped-row interfaces for data integrity.

---

## 🛠 Tech Stack

* **Frontend:** HTML5, Tailwind CSS (Modern Responsive Layout)
* **Templating:** EJS (Embedded JavaScript)
* **Backend:** Node.js / Express
* **Typography:** Inter / Sans-serif (Professional grade)
* **Icons/Charts:** Heroicons & Chart.js

---

## 📂 Project Structure

EduRate uses a modular component-based architecture for easy maintenance:

```text
/edurate
├── /public            # Static assets (CSS, Images, JS)
├── /views             # EJS Templates
│   ├── /partials      # Reusable components
│   │   ├── sidebar.ejs
│   │   ├── navbar.ejs
│   │   └── layout.ejs
│   ├── /admin         # Admin management pages
│   ├── /student       # Dashboard & Evaluation forms
│   └── /lecturer      # Results & Analytics
├── app.js             # Express server configuration
└── package.json       # Dependencies

```

---

## 🎨 UI/UX Guidelines

* **Primary Color:** `#1e3a8a` (Deep Academic Blue)
* **Background:** `#f3f4f6` (Light Gray)
* **Components:** White cards with `8px–12px` rounded corners and subtle shadows.
* **Responsiveness:** Mobile-first sidebar/navbar transition for tablets and smartphones.

---

## 🔧 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/edurate.git

```


2. **Install dependencies:**
```bash
npm install

```


3. **Run the application:**
```bash
npm start

```


4. **Access the portal:**
Navigate to `http://localhost:3000`

---

## 📜 License

This project is developed for academic purposes and is optimized for institutional deployment.

---
