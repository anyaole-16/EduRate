const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const Evaluation = require('../models/Evaluation');

// Show admin login page
exports.showLoginPage = (req, res) => {
  res.render('auth/adminLogin', { error: null, role: 'admin' });
};

// Handle admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.render('auth/adminLogin', { error: 'Invalid email or password', role: 'admin' });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.render('auth/adminLogin', { error: 'Invalid email or password', role: 'admin' });

    req.session.adminId = admin._id;
    req.session.role = 'admin';
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/adminLogin', { error: 'Something went wrong', role: 'admin' });
  }
};

/* ===========================
   CREATE STUDENT (WITH COURSES)
=========================== */
exports.createStudent = async (req, res) => {
  try {
    const { email, matricNumber, department, program, level } = req.body;

    // Get admin from session
    const admin = await Admin.findById(req.session.adminId).populate('school');
    if (!admin) return res.send('Admin not found');

    // Check email matches school domain
    if (!email.endsWith(admin.school.domain)) {
      return res.send(`Email must end with ${admin.school.domain}`);
    }

    // Prevent duplicate in same school
    const existing = await Student.findOne({
      $or: [{ email }, { matricNumber }],
      school: admin.school._id
    });
    if (existing) return res.send('Student already exists for this school');

    // Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Find courses for this student
    const courses = await Course.find({
      school: admin.school._id,
      department,
      program,
      level
    });

    // Create student
    const student = new Student({
      email,
      matricNumber,
      department,
      program,
      level,
      school: admin.school._id,
      courses: courses.map(c => c._id),
      password: hashedPassword,
      mustChangePassword: true
    });

    await student.save();

    // Send temporary password via email
    await sendEmail(
      email,
      'EduRate Temporary Password',
      `Hello ${matricNumber},\nYour temporary password is: ${tempPassword}\nPlease login and change it immediately.`
    );

    res.send(`Student ${matricNumber} created successfully with ${courses.length} courses assigned.`);
  } catch (err) {
    console.error(err);
    res.send('Error creating student');
  }
};

/* ===========================
   SHOW SCHOOL EVALUATION DASHBOARD
=========================== */
exports.dashboard = async (req, res) => {
  try {
    const admin = await Admin.findById(req.session.adminId).populate('school');
    if (!admin) return res.send('Admin not found');

    // Get all courses for this school
    const courses = await Course.find({ school: admin.school._id });

    // For each course, get evaluations
    const courseData = await Promise.all(
      courses.map(async course => {
        const evaluations = await Evaluation.find({ course: course._id }).populate('student');

        // Calculate average ratings
        let avgRatings = { clarity: 0, knowledge: 0, interaction: 0, punctuality: 0 };
        evaluations.forEach(e => {
          avgRatings.clarity += e.ratings.clarity;
          avgRatings.knowledge += e.ratings.knowledge;
          avgRatings.interaction += e.ratings.interaction;
          avgRatings.punctuality += e.ratings.punctuality;
        });
        const count = evaluations.length || 1; // avoid divide by zero
        avgRatings = {
          clarity: (avgRatings.clarity / count).toFixed(2),
          knowledge: (avgRatings.knowledge / count).toFixed(2),
          interaction: (avgRatings.interaction / count).toFixed(2),
          punctuality: (avgRatings.punctuality / count).toFixed(2),
        };

        return {
          course,
          evaluations,
          avgRatings,
        };
      })
    );

    // Pass role so header/footer partial works
    res.render('admin/dashboard', { admin, courseData, role: 'admin' });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
};
