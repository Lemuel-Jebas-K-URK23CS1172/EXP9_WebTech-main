import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    // ✅ Client-side validation
    if (!form.full_name || !form.email || !form.username || !form.password || !form.confirmPassword) {
      setLoading(false);
      return setMsg("Please fill all fields");
    }
    if (form.password.length < 6) {
      setLoading(false);
      return setMsg("Password must be at least 6 characters");
    }
    if (form.password !== form.confirmPassword) {
      setLoading(false);
      return setMsg("Passwords do not match");
    }

    try {
      const res = await axios.post(`${API}/auth/register`, form);
      setMsg("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // redirect after 2 seconds
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        width: "400px",
        margin: "50px auto",
        padding: "20px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <h3>Create an Account</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input name="full_name" value={form.full_name} placeholder="Full Name" onChange={handleChange} />
        <input name="email" value={form.email} placeholder="Email" onChange={handleChange} />
        <input name="username" value={form.username} placeholder="Username" onChange={handleChange} />
        <input name="password" type="password" value={form.password} placeholder="Password" onChange={handleChange} />
        <input name="confirmPassword" type="password" value={form.confirmPassword} placeholder="Confirm Password" onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {msg && <p className="msg" style={{ marginTop: "10px", color: msg.includes("✅") ? "green" : "red" }}>{msg}</p>}
    </div>
  );
}
