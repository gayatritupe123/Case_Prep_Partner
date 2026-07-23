const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  invitationId: { type: mongoose.Schema.Types.ObjectId, ref: "Invitation", required: true },
  userA: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meetLink: { type: String, required: true },
  suggestedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }],
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  status: { type: String, enum: ["upcoming", "completed"], default: "upcoming" },
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);