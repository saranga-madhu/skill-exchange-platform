import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar1 from "./Navbar1";
import { API_URL } from "./api";

function Login() {
  const navigate = useNavigate();

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard"); // Or wherever you want to go
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar1 />

      <div className="login-container">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">
          Sign in to continue your skill exchange journey
        </p>

        <div className="login-card">
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <label>Email Address</label>
            <div className="input-box">
              <span className="icon">✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@university.edu"
                required
              />
            </div>

            {/* Password */}
            <label>Password</label>
            <div className="input-box">
              <span className="icon">🔒</span>
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
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer", marginLeft: "5px" }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Options */}
            <div className="login-options">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <span className="forgot">Forgot password?</span>
            </div>

            {/* Button */}
            <button type="submit" className="login-btn">➜ Sign In</button>
          </form>

          <p className="register-link">
            Don’t have an account?
            <span onClick={() => navigate("/register")}>
              {" "}Create one now
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
