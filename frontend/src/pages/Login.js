import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.msg || "Error logging in");
    }
  };

  return (
    <div className="form-wrap card">
      <h2>Welcome back</h2>
      <p className="subtle">Log in to continue practicing.</p>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input placeholder="you@example.com" onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <label>Password</label>
        <input placeholder="Your password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button className="full" type="submit">Login</button>
      </form>

      <p className="subtle" style={{ marginTop: "1rem" }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}