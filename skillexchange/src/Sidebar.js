import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="profile">
        <div className="avatar">
          {user ? user.name.charAt(0).toUpperCase() : "👤"}
        </div>
        <h3>{user ? user.name : "Guest"}</h3>
        <p className="role">{user ? user.email : "Student"}</p>
        <p className="education">🎓 Computer Science</p> {/* Mock data for now as per request */}
      </div>

      <div className="menu">
        <button className="menu-btn active" onClick={() => navigate("/dashboard")}>
          🏠 Dashboard
        </button>
        <button className="menu-btn" onClick={() => navigate("/browse")}>
          🔍 Browse Skills
        </button>
        <button className="menu-btn" onClick={() => navigate("/messages")}>
          💬 Messages
        </button>
        <button className="menu-btn" onClick={() => navigate("/profile")}>👤 Profile</button>
      </div>

      <button className="logout-btn" onClick={handleLogout}>🔓 Logout</button>
    </div>
  );
}

export default Sidebar;
