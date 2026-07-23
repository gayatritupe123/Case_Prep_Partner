import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function ViewProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => setUser(res.data));
  }, [id]);

  if (!user) return <p className="subtle">Loading profile...</p>;

  return (
    <div className="card">
      <div className="badge-pill">{user.badge}</div>
      <h1 style={{ marginTop: "0.9rem" }}>{user.name}</h1>
      <p className="subtle">{user.email}</p>

      <hr className="divider" />

      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-num">{user.casesSolved}</div>
          <div className="stat-label">Cases Solved</div>
        </div>
        <div className="stat-block">
          <div className="stat-num">{user.rating} / 5</div>
          <div className="stat-label">Partner Rating</div>
        </div>
      </div>
    </div>
  );
}