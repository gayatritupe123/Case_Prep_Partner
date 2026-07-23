const express = require("express");
const Session = require("../models/Session");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all sessions where I'm a participant
router.get("/mine", auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ userA: req.user.id }, { userB: req.user.id }],
    })
      .populate("userA", "name")
      .populate("userB", "name")
      .populate("suggestedCases", "title difficulty topic")
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
