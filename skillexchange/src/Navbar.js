import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import skillMeetLogo from "./assests/SkillMeetLogo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        <img
          src={skillMeetLogo}
          alt="SkillMeet"
          className="logo-image"
          style={{ height: '70px' }}
        />
       
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
