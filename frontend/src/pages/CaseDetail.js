import { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    api.get(`/cases/${id}`).then((res) => setCaseData(res.data));
  }, [id]);

  if (!caseData) return <p>Loading...</p>;

  return (
    <div>
      <h2>{caseData.title}</h2>
      <p><em>Difficulty: {caseData.difficulty} | Topic: {caseData.topic}</em></p>

      <h3>Case Statement</h3>
      <p>{caseData.statement}</p>

      <h3>Relevant Data</h3>
      <p>{caseData.relevantData}</p>

      <hr />

      <button onClick={() => setShowHints(!showHints)}>
        {showHints ? "Hide Hints" : "Show Hints"}
      </button>
      {showHints && (
        <ul>
          {caseData.hints.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      <br />

      <button onClick={() => setShowSolution(!showSolution)}>
        {showSolution ? "Hide Solution" : "Show Solution"}
      </button>
      {showSolution && <p>{caseData.solution}</p>}
    </div>
  );
}