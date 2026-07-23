import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.msg || "Error signing up");
    }
  };

  return (
    <div className="form-wrap card">
      <h2>Create your account</h2>
      <p className="subtle">Join CasePrepPartner and start practicing with a partner.</p>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input placeholder="Your full name" onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label>Email</label>
        <input placeholder="you@example.com" onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <label>Password</label>
        <input placeholder="At least 6 characters" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button className="full" type="submit">Sign Up</button>
      </form>

      <p className="subtle" style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}