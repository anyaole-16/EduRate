const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Landing page student login
router.get("/login", authController.getStudentLogin); 
router.post("/login", authController.loginUser);

// Lecturer login
router.get("/lecturer/login", authController.getLecturerLogin);
router.post("/lecturer/login", authController.loginUser); // same loginUser function

// Admin login
router.get("/admin/login", authController.getAdminLogin);
router.post("/admin/login", authController.loginUser);

router.get("/logout", authController.logoutUser);

// Signup
router.get("/signup", authController.getSignup);
router.post("/signup", authController.signupUser);

// Change password
router.get("/change-password", authController.getChangePassword);
router.post("/change-password", authController.changePassword);

module.exports = router;
