import React from "react";
import Navbar from "./Navbar";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />

      <section className="hero">
        <h1 className="hero-title">
          Exchange Skills. <br /> Learn & Teach Together
        </h1>

        <p className="hero-description">
          Connect with fellow students to share knowledge, learn new skills,
          and grow together. Exchange your expertise in a collaborative
          university community.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn" onClick={() => navigate("/register")}>
            Get Started ➜
          </button>
          <button className="outline-btn" onClick={() => navigate("/browse")}>
            Browse Skills
          </button>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="icon-box purple-gradient">📚</div>
          <h3>Share Knowledge</h3>
          <p>Teach what you know and help others grow</p>
        </div>

        <div className="feature-card">
          <div className="icon-box pink-gradient">🎯</div>
          <h3>Learn New Skills</h3>
          <p>Discover and master skills from your peers</p>
        </div>

        <div className="feature-card">
          <div className="icon-box yellow-gradient">🤝</div>
          <h3>Build Community</h3>
          <p>Connect with students who share your interests</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
