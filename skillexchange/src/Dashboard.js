import { useState, useEffect } from "react";
import Navbar1 from "./Navbar1";
import Sidebar from "./Sidebar";
import SkillCard from "./Skillcard";
import RequestCard from "./Requestcard";
import "./Dashboard.css";
import { API_URL, getAuthHeaders } from "./api";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mySkills, setMySkills] = useState([]);
  const [requests, setRequests] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  // Modal state code can be removed if we are not using modal anymore, but I will keep cleanup minimal first.
  // Actually, user asked to move to new page, so we don't need modal anymore.
  // I will remove modal state and modal JSX.

  /* eslint-disable react-hooks/exhaustive-deps */
  const fetchMySkills = async () => {
    try {
      const response = await fetch(`${API_URL}/skills?user_id=${user.id}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (Array.isArray(data)) setMySkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/requests`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.received) setRequests(data.received);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMySkills();
      fetchRequests();
    }
  }, [user]);

  const handleRequestAction = async (id, status) => {
    try {
      await fetch(`${API_URL}/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });
      fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <>
      <Navbar1 onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="dashboard-layout">
        <Sidebar isOpen={sidebarOpen} />

        <div className="dashboard-content">
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your skills and track your exchanges
          </p>

          {/* My Skills */}
          <div className="skills-header">
            <h2>My Skills</h2>
            <button className="add-skill-btn" onClick={() => navigate("/add-skill")}>+ Add New Skill</button>
          </div>

          <div className="skills-grid">
            {mySkills.length > 0 ? (
              mySkills.map(skill => (
                <SkillCard key={skill.id} title={skill.name} category={skill.category} students="0 students" />
              ))
            ) : (
              <p>You haven't added any skills yet.</p>
            )}
          </div>

          {/* Requests */}
          <h2 className="section-title">Incoming Requests</h2>

          {requests.filter(r => r.status === 'pending').length > 0 ? (
            requests.filter(r => r.status === 'pending').map(req => (
              <RequestCard
                key={req.id}
                name={req.sender_name}
                skill={req.skill_name}
                time={new Date(req.created_at).toLocaleDateString()}
                onAccept={() => handleRequestAction(req.id, 'accepted')}
                onDecline={() => handleRequestAction(req.id, 'rejected')}
              />
            ))
          ) : (
            <p>No new requests.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
