import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Navbar1 from "./Navbar1";
import { API_URL } from "./api";

function Register() {
  const navigate = useNavigate();

  //  States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar1 />
      <div className="register-page">
        <h1 className="register-title">Join SkillExchange</h1>
        <p className="register-subtitle">
          Create your account and start exchanging skills today
        </p>

        <div className="register-card">
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@university.edu"
              required
            />

            {/* Password */}
            <label>Password</label>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(prev => !prev)}
                style={{ cursor: "pointer", marginLeft: "5px" }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Confirm Password */}
            <label>Confirm Password</label>
            <div className="input-box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                style={{ cursor: "pointer", marginLeft: "5px" }}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <div className="terms">
              <input type="checkbox" required />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </div>

            <button type="submit" className="create-btn">Create Account</button>
          </form>

          <p className="login-link">
            Already have an account? <span onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Sign in</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
