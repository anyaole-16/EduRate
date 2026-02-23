const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "lecturer", "admin"],
    required: true
  },
  tempPassword: { type: Boolean, default: false } // true if user is using temporary password
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
