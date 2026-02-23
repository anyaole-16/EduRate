const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  matric: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  faculty: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ["student", "lecturer", "admin"],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  tempPassword: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: helper to compare password
userSchema.methods.comparePassword = async function(password) {
  const bcrypt = require("bcrypt");
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);