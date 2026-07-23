const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  topic: { type: String, required: true }, // e.g. "profitability", "market-entry"
  statement: { type: String, required: true },
  relevantData: { type: String, required: true },
  hints: [{ type: String }],
  solution: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Case", caseSchema);