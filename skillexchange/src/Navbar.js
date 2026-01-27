import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
     <div className="logo">
        <div className="logo-icon">SE</div>
        <span>SkillExchange</span>
      </div>
      
         <div className="nav-links">
        
          <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
        
          <button className="primary-btn" onClick={() => navigate("/login")}>Login</button>
        
      </div>
    </nav>
  );
}

export default Navbar;
