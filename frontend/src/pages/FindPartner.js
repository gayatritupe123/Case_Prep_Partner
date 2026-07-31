import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function FindPartner() {
  const [tab, setTab] = useState("browse"); // "browse" | "post"
  const [invitations, setInvitations] = useState([]);
  const [form, setForm] = useState({ availableDate: "", availableTime: "", note: "" });

  useEffect(() => {
    if (tab === "browse") fetchInvitations();
  }, [tab]);

  const fetchInvitations = async () => {
    try {
      const res = await api.get("/invitations");
      setInvitations(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Error loading invitations");
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await api.post("/invitations", form);
      alert("Invitation posted! Other users can now find and accept it.");
      setForm({ availableDate: "", availableTime: "", note: "" });
      setTab("browse");
    } catch (err) {
      alert(err.response?.data?.msg || "Error posting invitation");
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await api.post(`/invitations/${id}/accept`);
      alert(`Session confirmed! Meet link: ${res.data.meetLink}\nCheck "My Sessions" to join.`);
      fetchInvitations();
    } catch (err) {
      alert(err.response?.data?.msg || "Error accepting invitation");
    }
  };

  return (
    <div>
      <h2>Find a Partner</h2>
      <p className="subtle">Post your availability, or browse invitations from other users.</p>

      <div style={{ display: "flex", gap: "0.75rem", margin: "1.25rem 0" }}>
        <button className={tab === "browse" ? "" : "secondary"} onClick={() => setTab("browse")}>
          Browse Invitations
        </button>
        <button className={tab === "post" ? "" : "secondary"} onClick={() => setTab("post")}>
          Post an Invitation
        </button>
      </div>

      {tab === "post" && (
        <div className="card" style={{ maxWidth: 420 }}>
          <form onSubmit={handlePost}>
            <label>Available Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.availableDate}
              onChange={(e) => setForm({ ...form, availableDate: e.target.value })}
              required
            />

            <label>Available Time</label>
            <input
              type="time"
              value={form.availableTime}
              onChange={(e) => setForm({ ...form, availableTime: e.target.value })}
              required
            />

            <label>Note (optional)</label>
            <input
              placeholder="e.g. prefer market entry cases"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />

            <button className="full" type="submit">Post Invitation</button>
          </form>
        </div>
      )}

      {tab === "browse" && (
        <div>
          {invitations.length === 0 && (
            <div className="empty-state">No open invitations right now. Post one to get started.</div>
          )}
          {invitations.map((inv) => (
            <div className="card" key={inv._id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Link to={`/profile/${inv.createdBy._id}`}>
                    <h3 style={{ color: "var(--ink)", marginBottom: "0.25rem" }}>{inv.createdBy.name}</h3>
                  </Link>
                  <div className="tag-row" style={{ marginBottom: "0.5rem" }}>
                    <span className="tag">{inv.createdBy.badge}</span>
                    <span className="tag">Rating: {inv.createdBy.rating} / 5</span>
                    <span className="tag">{inv.createdBy.casesSolved} cases solved</span>
                  </div>
                  <p style={{ margin: 0 }}>
                    <strong>{inv.availableDate}</strong> at <strong>{inv.availableTime}</strong>
                  </p>
                  {inv.note && <p className="subtle" style={{ marginTop: "0.35rem" }}>"{inv.note}"</p>}
                </div>
                <button onClick={() => handleAccept(inv._id)}>Accept</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
