import React from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import "./Home.css";
import skillMeetLogo from "./assests/SkillMeetLogo.png";


function Navbar1({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">

    <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        <img
          src={skillMeetLogo}
          alt="SkillMeet"
          className="logo-image"
          style={{ height: '80px' }}
        />
        
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
