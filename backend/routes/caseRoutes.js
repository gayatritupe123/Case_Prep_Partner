const express = require("express");
const Case = require("../models/Case");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all cases (with optional filters) - hints/solution excluded from list view
router.get("/", auth, async (req, res) => {
  try {
    const { difficulty, topic } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = topic;

    const cases = await Case.find(filter).select("title difficulty topic");
    res.json(cases);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET single case (full detail - statement + data always sent, hints/solution too,
// frontend controls whether to visually reveal them)
router.get("/:id", auth, async (req, res) => {
  try {
    const singleCase = await Case.findById(req.params.id);
    if (!singleCase) return res.status(404).json({ msg: "Case not found" });
    res.json(singleCase);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;