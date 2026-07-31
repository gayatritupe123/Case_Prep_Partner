const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Invitation = require("../models/Invitation");
const Session = require("../models/Session");
const Case = require("../models/Case");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

const router = express.Router();

// POST a new invitation
router.post("/", auth, async (req, res) => {
  try {
    const { availableDate, availableTime, note } = req.body;

    // block past date/time
    const proposedDateTime = new Date(`${availableDate}T${availableTime}`);
    if (isNaN(proposedDateTime.getTime())) {
      return res.status(400).json({ msg: "Invalid date or time" });
    }
    if (proposedDateTime < new Date()) {
      return res.status(400).json({ msg: "You can only schedule sessions for the current date/time or later" });
    }

    const invitation = await Invitation.create({
      createdBy: req.user.id,
      availableDate,
      availableTime,
      note,
    });
    res.json(invitation);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET all OPEN invitations (excluding ones created by the logged-in user, and excluding past ones)
router.get("/", auth, async (req, res) => {
  try {
    const invitations = await Invitation.find({
      status: "open",
      createdBy: { $ne: req.user.id },
    })
      .populate("createdBy", "name badge rating casesSolved")
      .sort({ createdAt: -1 });

    // filter out invitations whose date/time has already passed
    const now = new Date();
    const upcoming = invitations.filter((inv) => {
      const dt = new Date(`${inv.availableDate}T${inv.availableTime}`);
      return dt >= now;
    });

    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET invitations I created (to track their status)
router.get("/mine", auth, async (req, res) => {
  try {
    const invitations = await Invitation.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ACCEPT an invitation -> creates a Session with a Jitsi link + 2 random suggested cases
router.post("/:id/accept", auth, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) return res.status(404).json({ msg: "Invitation not found" });
    if (invitation.status !== "open") return res.status(400).json({ msg: "Invitation already accepted" });
    if (invitation.createdBy.toString() === req.user.id) {
      return res.status(400).json({ msg: "You cannot accept your own invitation" });
    }

    invitation.status = "accepted";
    invitation.acceptedBy = req.user.id;
    await invitation.save();

    // pick 2 random cases to suggest
    const randomCases = await Case.aggregate([{ $sample: { size: 2 } }]);

    const roomId = uuidv4().slice(0, 8);
    const meetLink = `https://meet.jit.si/casepreppartner-${roomId}`;

    const session = await Session.create({
      invitationId: invitation._id,
      userA: invitation.createdBy,
      userB: invitation.acceptedBy,
      meetLink,
      suggestedCases: randomCases.map((c) => c._id),
      scheduledDate: invitation.availableDate,
      scheduledTime: invitation.availableTime,
    });

    await Notification.create({
      userId: invitation.createdBy,
      message: `Your invitation was accepted! Session scheduled for ${invitation.availableDate} at ${invitation.availableTime}.`,
      link: "/sessions",
    });

    res.json(session);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
