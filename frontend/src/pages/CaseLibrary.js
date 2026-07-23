import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function CaseLibrary() {
  const [cases, setCases] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line
  }, [difficulty, topic]);

  const fetchCases = async () => {
    try {
      const params = {};
      if (difficulty) params.difficulty = difficulty;
      if (topic) params.topic = topic;
      const res = await api.get("/cases", { params });
      setCases(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Error loading cases");
    }
  };

  const tagClass = (d) =>
    d === "easy" ? "tag tag-easy" : d === "medium" ? "tag tag-medium" : "tag tag-hard";

  return (
    <div>
      <h2>Case Library</h2>
      <p className="subtle">Browse cases by difficulty and topic, then practice solo or with a partner.</p>

      <div style={{ display: "flex", gap: "1rem", margin: "1.25rem 0" }}>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All Topics</option>
          <option value="profitability">Profitability</option>
          <option value="market-entry">Market Entry</option>
        </select>
      </div>

      {cases.length === 0 && (
        <div className="empty-state">No cases match these filters yet.</div>
      )}

      {cases.map((c) => (
        <Link to={`/cases/${c._id}`} className="card-link" key={c._id}>
          <h3>{c.title}</h3>
          <div className="tag-row">
            <span className={tagClass(c.difficulty)}>{c.difficulty}</span>
            <span className="tag">{c.topic}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}