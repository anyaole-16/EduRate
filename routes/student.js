const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");

// Middleware to ensure only logged-in students access dashboard
const requireStudent = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "student") {
    return res.redirect("/login");
  }
  next();
};

// ---------------- DASHBOARD ----------------
router.get("/dashboard", requireStudent, async (req, res) => {
  try {
    const student = await User.findById(req.session.user.id);
    if (!student) return res.redirect("/login");

    const courses = await Course.find({ department: student.department });

    res.render("student/dashboard", {
      user: student,
      courses
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.send("Server error");
  }
});

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  try {
    const { name, matric, faculty, department, email } = req.body;

    console.log("REQ BODY:", req.body);

    if (!name || !matric || !faculty || !department || !email) {
      return res.send("All fields required");
    }

    const tempPassword = Math.random().toString(36).slice(-8);

    const user = new User({
      name,
      matric,
      faculty,
      department,
      email,
      password: tempPassword
    });

    await user.save();

    res.render("signup", { error: null, success: "Signup successful! Please check your email for login details." });
    

    res.redirect("/login");

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.send("Error during signup");
  }
});

module.exports = router;