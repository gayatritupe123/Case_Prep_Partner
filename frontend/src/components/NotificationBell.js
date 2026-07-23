import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // poll every 20s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await api.get("/notifications/mine");
      setNotifications(res.data);
    } catch (err) {
      // silently ignore if not logged in
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClickNotification = async (n) => {
    await api.post(`/notifications/${n._id}/read`);
    setOpen(false);
    fetchNotifications();
    if (n.link) navigate(n.link);
  };

  const markAllRead = async () => {
    await api.post("/notifications/read-all");
    fetchNotifications();
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        className="secondary"
        onClick={() => setOpen(!open)}
        style={{ position: "relative", padding: "0.5rem 0.75rem" }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "var(--red)",
              color: "#fff",
              borderRadius: "100px",
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "1px 5px",
              lineHeight: 1.3,
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="card"
          style={{
            position: "absolute",
            right: 0,
            top: "3rem",
            width: 320,
            maxHeight: 380,
            overflowY: "auto",
            zIndex: 100,
            padding: "0.75rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <strong style={{ fontSize: "0.9rem" }}>Notifications</strong>
            {unreadCount > 0 && (
              <button className="secondary" onClick={markAllRead} style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 && <p className="subtle" style={{ fontSize: "0.85rem" }}>No notifications yet.</p>}

          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleClickNotification(n)}
              style={{
                padding: "0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                background: n.read ? "transparent" : "var(--gold-soft)",
                marginBottom: "0.25rem",
                fontSize: "0.85rem",
              }}
            >
              {n.message}
              <div className="subtle" style={{ fontSize: "0.7rem", marginTop: "0.2rem" }}>
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
