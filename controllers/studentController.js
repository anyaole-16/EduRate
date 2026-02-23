const Student = require('../models/Student');
const Course = require('../models/Course');
const Evaluation = require('../models/Evaluation');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

/* ===========================
   AUTH AND SIGNUP (TEMP PASSWORD)
=========================== */

// Show login page
exports.showLoginPage = (req, res) => {
  res.render('auth/login', { error: null, role: 'student' });
};

// Handle login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email }).populate('courses');
    if (!student) {
      return res.render('auth/login', { error: 'Invalid email or password', role: 'student' });
    }

    const isValid = await bcrypt.compare(password, student.password);
    if (!isValid) {
      return res.render('auth/login', { error: 'Invalid email or password', role: 'student' });
    }

    req.session.userId = student._id;
    req.session.role = 'student';

    // Force password change if first login
    if (student.mustChangePassword) {
      return res.redirect('/student/change-password');
    }

    res.redirect('/student/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Something went wrong. Try again.', role: 'student' });
  }
};

/* ===========================
   CHANGE PASSWORD
=========================== */

exports.showChangePassword = (req, res) => {
  res.render('auth/changePassword', { error: null, role: 'student' });
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const hashed = await bcrypt.hash(newPassword, 10);

    await Student.findByIdAndUpdate(req.session.userId, {
      password: hashed,
      mustChangePassword: false
    });

    res.redirect('/student/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/changePassword', { error: 'Could not change password', role: 'student' });
  }
};

/* ===========================
   DASHBOARD
=========================== */

exports.dashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.session.userId).populate('courses');

    // Group courses by level
    const coursesByLevel = {};
    student.courses.forEach(course => {
      const level = course.level;
      if (!coursesByLevel[level]) {
        coursesByLevel[level] = [];
      }
      coursesByLevel[level].push(course);
    });

    res.render('student/dashboard', { student, coursesByLevel, role: 'student' });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
};

/* ===========================
   SHOW EVALUATION FORM (COURSE LOCK)
=========================== */

// Show evaluation form for a course
exports.showEvaluationForm = async (req, res) => {
  try {
    const student = await Student.findById(req.session.userId).populate('courses');

    // Ensure student can evaluate this course
    const course = student.courses.find(c => c._id.toString() === req.params.courseId);
    if (!course) return res.send('You are not allowed to evaluate this course');

    // Check if already evaluated
    const existing = await Evaluation.findOne({
      student: student._id,
      course: course._id
    });

    if (existing) return res.send('You have already evaluated this course');

    res.render('student/evaluationForm', { course, role: 'student' });
  } catch (err) {
    console.error(err);
    res.send('Error loading evaluation form');
  }
};

// Submit evaluation
exports.submitEvaluation = async (req, res) => {
  try {
    const student = await Student.findById(req.session.userId).populate('courses');
    const course = student.courses.find(c => c._id.toString() === req.params.courseId);
    if (!course) return res.send('You are not allowed to evaluate this course');

    const { clarity, knowledge, interaction, punctuality, comment } = req.body;

    // Prevent duplicate submission
    const existing = await Evaluation.findOne({
      student: student._id,
      course: course._id
    });
    if (existing) return res.send('You have already evaluated this course');

    const evaluation = new Evaluation({
      student: student._id,
      course: course._id,
      ratings: { clarity, knowledge, interaction, punctuality },
      comment
    });

    await evaluation.save();
    res.send('Evaluation submitted successfully');
  } catch (err) {
    console.error(err);
    res.send('Error submitting evaluation');
  }
};

/* ===========================
   LOGOUT
=========================== */

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/student/login');
  });
};
