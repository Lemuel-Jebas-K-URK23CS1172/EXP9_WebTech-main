import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return setMsg("Please fill all fields");
    try {
      const res = await axios.post(`${API}/auth/login`, { identifier, password });
      // Store token and redirect
      localStorage.setItem("vc_token", res.data.token);
      localStorage.setItem("vc_user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="card">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <input placeholder="Username or Email" value={identifier} onChange={e => setIdentifier(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {msg && <p className="msg">{msg}</p>}
    </div>
  );
}
