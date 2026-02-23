require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/edurate')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


// ----- Middleware -----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,

  resave: false,
  saveUninitialized: false
}));

// ----- View Engine -----
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ----- Routes -----
const indexRoutes = require("./routes/indexRoutes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

const studentRoutes = require("./routes/student");
app.use("/student", studentRoutes);

app.get('/', (req, res) => res.redirect('/login'));

// ----- Start Server -----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));