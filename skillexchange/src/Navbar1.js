import React from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import "./Home.css";


function Navbar1({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">


      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        <div className="logo-icon">SE</div>
        <span className="logo-text">SkillExchange</span>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <button className="primary-btn" onClick={() => navigate("/")}>Home</button>
        <button className="primary-btn" onClick={() => navigate("/browse")}>Browse Skills</button>
        <button className="primary-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button className="primary-btn" onClick={() => navigate("/messages")}>Messages</button>

    
      </div>
    </nav>
  );
}

export default Navbar1;
