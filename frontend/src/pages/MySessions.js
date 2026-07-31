import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [givenFeedback, setGivenFeedback] = useState([]);
  const [activeFeedback, setActiveFeedback] = useState(null); // sessionId currently rating
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const myUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [sessionsRes, feedbackRes] = await Promise.all([
      api.get("/sessions/mine"),
      api.get("/feedback/mine"),
    ]);
    setSessions(sessionsRes.data);
    setGivenFeedback(feedbackRes.data);
  };

  const partnerName = (session) => {
    if (session.userA._id === myUser.id) return session.userB.name;
    return session.userA.name;
  };

  const submitFeedback = async (sessionId) => {
    try {
      await api.post("/feedback", { sessionId, rating, comment });
      alert("Feedback submitted. Thanks!");
      setActiveFeedback(null);
      setRating(5);
      setComment("");
      loadData();
    } catch (err) {
      alert(err.response?.data?.msg || "Error submitting feedback");
    }
  };

  // only show sessions that are upcoming (current date/time or later) OR already completed
  const now = new Date();
  const visibleSessions = sessions.filter((s) => {
    if (s.status === "completed") return true;
    const sessionDateTime = new Date(`${s.scheduledDate}T${s.scheduledTime}`);
    return sessionDateTime >= now;
  });

  return (
    <div>
      <h2>My Sessions</h2>
      <p className="subtle">Your confirmed practice sessions. Join the call at the scheduled time.</p>

      {visibleSessions.length === 0 && (
        <div className="empty-state">No upcoming sessions yet. Head to Find Partner to set one up.</div>
      )}

      {visibleSessions.map((s) => {
        const alreadyGiven = givenFeedback.includes(s._id);

        return (
          <div className="card" key={s._id}>
            <div className="tag-row" style={{ marginBottom: "0.5rem" }}>
              <span className="tag">{s.status}</span>
            </div>
            <Link to={`/profile/${s.userA._id === myUser.id ? s.userB._id : s.userA._id}`}>
              <h3 style={{ color: "var(--ink)" }}>Practice with {partnerName(s)}</h3>
            </Link>
            <p>
              <strong>{s.scheduledDate}</strong> at <strong>{s.scheduledTime}</strong> &middot; 45 min
            </p>

            <a href={s.meetLink} target="_blank" rel="noreferrer">
              <button style={{ marginTop: "0.5rem" }}>Join Video Call</button>
            </a>

            <hr className="divider" />

            <h3>Suggested Cases</h3>
            {s.suggestedCases.map((c) => (
              <Link to={`/cases/${c._id}`} className="card-link" key={c._id} style={{ background: "var(--bg)" }}>
                <strong>{c.title}</strong>
                <div className="tag-row" style={{ marginTop: "0.35rem" }}>
                  <span className="tag">{c.difficulty}</span>
                  <span className="tag">{c.topic}</span>
                </div>
              </Link>
            ))}
            <p className="subtle">Or bring your own case to discuss instead.</p>

            <hr className="divider" />

            {alreadyGiven ? (
              <p className="subtle">You've submitted feedback for this session.</p>
            ) : activeFeedback === s._id ? (
              <div className="card" style={{ background: "var(--bg)" }}>
                <label>Rate {partnerName(s)} (1-5)</label>
                <div style={{ display: "flex", gap: "0.4rem", margin: "0.5rem 0" }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className={rating === n ? "" : "secondary"}
                      onClick={() => setRating(n)}
                      type="button"
                      style={{ padding: "0.5rem 0.9rem" }}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <label>Comment (optional)</label>
                <textarea
                  rows={3}
                  placeholder="How did the session go?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <button onClick={() => submitFeedback(s._id)}>Submit Feedback</button>
                  <button className="secondary" onClick={() => setActiveFeedback(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="secondary" onClick={() => setActiveFeedback(s._id)}>
                Give Feedback
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
