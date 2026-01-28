import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">SE</div>
        <span className="logo-text">SkillExchange</span>
      </div>

      <div className="nav-links">
        <button className="login-btn-simple" onClick={() => navigate("/login")}>
          <span className="login-icon">➜</span> Login
        </button>
        <button className="register-btn" onClick={() => navigate("/register")}>
           Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
