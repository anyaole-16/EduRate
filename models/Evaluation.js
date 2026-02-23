const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

  rating: { type: Number, min: 1, max: 5 },
  feedback: String
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);
