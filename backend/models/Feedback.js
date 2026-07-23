const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
}, { timestamps: true });

// prevents the same user from submitting feedback twice for the same session
feedbackSchema.index({ sessionId: 1, fromUser: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
