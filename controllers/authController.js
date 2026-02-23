const bcrypt = require("bcrypt");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ---------------- LOGIN ----------------
const getLogin = (req, res) => {
  res.render("login", { error: null, role: "student" });
};

const getStudentLogin = (req, res) => {
  res.render("login", { error: null, role: "student" });
};

const getLecturerLogin = (req, res) => {
  res.render("login", { error: null, role: "lecturer" });
};

const getAdminLogin = (req, res) => {
  res.render("login", { error: null, role: "admin" });
};

const loginUser = async (req, res) => {
  let { id, password, role } = req.body;

  if (!id || !password || !role) {
    return res.render("login", { error: "All fields are required", role });
  }

  id = id.trim().toLowerCase();
  role = role.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: id, role });

    if (!user) {
      return res.render("login", { error: "User not found", role });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render("login", { error: "Invalid password", role });
    }

    req.session.user = { id: user._id, role: user.role };

    if (user.tempPassword) return res.redirect("/change-password");

    if (user.role === "student") return res.redirect("/student/dashboard");
    if (user.role === "lecturer") return res.redirect("/lecturer/dashboard");
    if (user.role === "admin") return res.redirect("/admin/dashboard");

  } catch (err) {
    console.error(err);
    res.render("login", { error: "Server error", role });
  }
};

// ---------------- LOGOUT ----------------
const logoutUser = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};

// ---------------- SIGNUP ----------------
const getSignup = (req, res) => {
  res.render("signup", { error: null, success: null });
};

const signupUser = async (req, res) => {
  const { name, matric, department, faculty, email, role } = req.body;

  if (!name || !matric || !department || !faculty || !email || !role) {
    return res.render("signup", { error: "All fields required", success: null });
  }

  try {
    const existing = await User.findOne({ $or: [{ email }, { matric }] });
    if (existing) {
      return res.render("signup", { error: "User already exists", success: null });
    }

    const tempPassword = crypto.randomBytes(4).toString("hex");
    const hashed = await bcrypt.hash(tempPassword, 10);

    await User.create({
      name,
      matric,
      department,
      faculty,
      email,
      role,
      password: hashed,
      tempPassword: true
    });

    console.log("USER SAVED");

    // ---------------- EMAIL ----------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"EduRate Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Temporary Password",
      html: `
        <p>Hello ${name},</p>
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please login and change it immediately.</p>
      `
    });

    console.log("EMAIL SENT:", info.response);

    res.render("signup", {
      success: "Account created! Check your email.",
      error: null
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.render("signup", { error: err.message, success: null });
  }
};

// ---------------- CHANGE PASSWORD ----------------
const getChangePassword = (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("change-password", { error: null });
};

const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.render("change-password", { error: "Password cannot be empty" });
  }

  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return res.redirect("/login");

    user.password = await bcrypt.hash(newPassword, 10);
    user.tempPassword = false;

    await user.save();

    res.redirect("/login");

  } catch (err) {
    console.error(err);
    res.render("change-password", { error: "Server error" });
  }
};

module.exports = {
  getLogin,
  getStudentLogin,
  getLecturerLogin,
  getAdminLogin,
  loginUser,
  logoutUser,
  getSignup,
  signupUser,
  getChangePassword,
  changePassword
};