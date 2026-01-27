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
        <span>SkillExchange</span>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <button className="primary-btn" onClick={() => navigate("/")}>Home</button>
        <button className="primary-btn" onClick={() => navigate("/browse")}>Browse Skills</button>
        <button className="primary-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button className="primary-btn" onClick={() => navigate("/messages")}>Messages</button>

        {/* Profile icon button */}
        <button
          className="profile-btn"
          onClick={() => navigate("/profile")}
          title="Profile"
        >
          {/* Simple circular icon with initials or emoji */}
          <span role="img" aria-label="profile">
            👤
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar1;
