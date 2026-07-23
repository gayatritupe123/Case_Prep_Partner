const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availableDate: { type: String, required: true }, // e.g. "2026-07-25"
  availableTime: { type: String, required: true }, // e.g. "18:00"
  status: { type: String, enum: ["open", "accepted"], default: "open" },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Invitation", invitationSchema);