const express = require("express");
const Invitation = require("../models/Invitation");
const Session = require("../models/Session");
const CaseModel = require("../models/Case");
const auth = require("../middleware/auth");

const Notification = require("../models/Notification");

const router = express.Router();

// POST a new invitation (upload your available slot)
router.post("/", auth, async (req, res) => {
  try {
    const { availableDate, availableTime } = req.body;
    if (!availableDate || !availableTime) {
      return res.status(400).json({ msg: "Date and time are required" });
    }
    const invitation = await Invitation.create({
      createdBy: req.user.id,
      availableDate,
      availableTime,
    });
    res.json(invitation);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET all OPEN invitations (excluding your own) - the browse list
router.get("/", auth, async (req, res) => {
  try {
    const invitations = await Invitation.find({
      status: "open",
      createdBy: { $ne: req.user.id },
    })
      .populate("createdBy", "name badge rating")
      .sort({ availableDate: 1, availableTime: 1 });
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET my own posted invitations (to see if anyone accepted yet)
router.get("/mine", auth, async (req, res) => {
  try {
    const invitations = await Invitation.find({ createdBy: req.user.id })
      .populate("acceptedBy", "name badge rating")
      .sort({ createdAt: -1 });
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ACCEPT an invitation -> creates a Session with meet link + 2 suggested cases
router.post("/:id/accept", auth, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) return res.status(404).json({ msg: "Invitation not found" });
    if (invitation.status !== "open") return res.status(400).json({ msg: "Invitation already accepted" });
    if (invitation.createdBy.toString() === req.user.id) {
      return res.status(400).json({ msg: "You can't accept your own invitation" });
    }

    invitation.status = "accepted";
    invitation.acceptedBy = req.user.id;
    await invitation.save();

    // Generate a unique Jitsi meet link
    const roomId = `casepreppartner-${invitation._id}-${Date.now()}`;
    const meetLink = `https://meet.jit.si/${roomId}`;

    // Pick 2 random cases to suggest
    const suggestedCases = await CaseModel.aggregate([{ $sample: { size: 2 } }]);

    const session = await Session.create({
      invitationId: invitation._id,
      userA: invitation.createdBy,
      userB: invitation.acceptedBy,
      meetLink,
      suggestedCases: suggestedCases.map((c) => c._id),
      scheduledDate: invitation.availableDate,
      scheduledTime: invitation.availableTime,
    });
    await Notification.create({
       userId: invitation.createdBy,
       message: `Your invitation was accepted! Session scheduled for ${invitation.availableDate} at ${invitation.availableTime}.`,
       link: "/sessions",
    });

    const populated = await Session.findById(session._id)
      .populate("userA", "name badge")
      .populate("userB", "name badge")
      .populate("suggestedCases", "title difficulty topic");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;