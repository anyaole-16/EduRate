const Lecturer = require('../models/Lecturer');
const Course = require('../models/Course');
const Evaluation = require('../models/Evaluation');
const bcrypt = require('bcrypt');

// Show login page
exports.showLoginPage = (req, res) => {
  res.render('auth/loginLecturer', { error: null });
};

// Handle login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const lecturer = await Lecturer.findOne({ email });
  if (!lecturer) return res.render('auth/loginLecturer', { error: 'Invalid email or password' });

  const isValid = await bcrypt.compare(password, lecturer.password);
  if (!isValid) return res.render('auth/loginLecturer', { error: 'Invalid email or password' });

  req.session.userId = lecturer._id;
  req.session.role = 'lecturer';
  res.redirect('/lecturer/dashboard');
};

// Lecturer dashboard
exports.dashboard = async (req, res) => {
  const lecturer = await Lecturer.findById(req.session.userId).populate('courses');

  // Get evaluations for all lecturer's courses
  const evaluationsData = [];

  for (let course of lecturer.courses) {
    const evaluations = await Evaluation.find({ course: course._id });

    if (evaluations.length === 0) continue;

    // Calculate averages
    const avgRatings = {
      clarity: 0,
      knowledge: 0,
      interaction: 0,
      punctuality: 0
    };

    evaluations.forEach(e => {
      avgRatings.clarity += e.ratings.clarity;
      avgRatings.knowledge += e.ratings.knowledge;
      avgRatings.interaction += e.ratings.interaction;
      avgRatings.punctuality += e.ratings.punctuality;
    });

    const count = evaluations.length;
    for (let key in avgRatings) avgRatings[key] = (avgRatings[key] / count).toFixed(2);

    const comments = evaluations.map(e => e.comment).filter(c => c);

    evaluationsData.push({
      course,
      avgRatings,
      comments,
      totalResponses: count
    });
  }

  res.render('lecturer/dashboard', { lecturer, evaluationsData });
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/lecturer/login');
};