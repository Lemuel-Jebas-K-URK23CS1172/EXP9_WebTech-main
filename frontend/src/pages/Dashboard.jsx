import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("vc_user") || "null");

  const logout = () => {
    localStorage.removeItem("vc_token");
    localStorage.removeItem("vc_user");
    navigate("/login");
  };

  if (!user) return <div className="card"><h4>Not logged in</h4><button onClick={() => navigate("/login")}>Go to Login</button></div>;

  return (
    <div className="card">
      <h3>Welcome, {user.full_name}</h3>
      <p>Username: {user.username}</p>
      <p>Virtual Classroom Dashboard placeholder — you can add protected features here.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
