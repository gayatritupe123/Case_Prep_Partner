const express = require("express");
const Feedback = require("../models/Feedback");
const Session = require("../models/Session");
const User = require("../models/User");
const auth = require("../middleware/auth");

const Notification = require("../models/Notification");

const router = express.Router();

function calculateBadge(casesSolved) {
  if (casesSolved >= 30) return "Expert";
  if (casesSolved >= 15) return "Pro";
  if (casesSolved >= 5) return "Practitioner";
  return "Beginner";
}

// POST feedback for a session
router.post("/", auth, async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    const myId = req.user.id;
    const isUserA = session.userA.toString() === myId;
    const isUserB = session.userB.toString() === myId;
    if (!isUserA && !isUserB) return res.status(403).json({ msg: "Not part of this session" });

    const toUser = isUserA ? session.userB : session.userA;

    // create feedback (unique index blocks duplicate submissions)
    const feedback = await Feedback.create({
      sessionId,
      fromUser: myId,
      toUser,
      rating,
      comment,
    });

    // recalculate target user's average rating
    const allFeedbackForUser = await Feedback.find({ toUser });
    const avgRating =
      allFeedbackForUser.reduce((sum, f) => sum + f.rating, 0) / allFeedbackForUser.length;

    const targetUser = await User.findById(toUser);
    targetUser.rating = Math.round(avgRating * 10) / 10; // rounded to 1 decimal
    targetUser.ratingCount = allFeedbackForUser.length;
    targetUser.casesSolved += 1;
    targetUser.badge = calculateBadge(targetUser.casesSolved);
    await targetUser.save();

    await Notification.create({
     userId: toUser,
     message: `You received new feedback and a ${rating}/5 rating.`,
     link: "/profile",
    });

    // mark session completed once both sides have given feedback
    const feedbackCountForSession = await Feedback.countDocuments({ sessionId });
    if (feedbackCountForSession >= 2) {
      session.status = "completed";
      await session.save();
    }

    res.json(feedback);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "You already submitted feedback for this session" });
    }
    res.status(500).json({ msg: err.message });
  }
});

// GET feedback I've already given (so frontend knows which sessions still need it)
router.get("/mine", auth, async (req, res) => {
  try {
    const given = await Feedback.find({ fromUser: req.user.id }).select("sessionId");
    res.json(given.map((f) => f.sessionId.toString()));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
