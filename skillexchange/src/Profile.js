import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar1 from "./Navbar1";
import Sidebar from "./Sidebar";
import SkillCard from "./Skillcard";
import { API_URL, getAuthHeaders } from "./api";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const [user] = useState(JSON.parse(localStorage.getItem("user")));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mySkills, setMySkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMySkills = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${API_URL}/skills?user_id=${user.id}`, {
                    headers: getAuthHeaders()
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setMySkills(data);
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMySkills();
    }, [user]);

    if (!user) {
        return (
            <div className="profile-error">
                <p>No user logged in.</p>
                <button className="primary-btn" onClick={() => navigate("/login")}>Go to Login</button>
            </div>
        );
    }

    return (
        <>
            <Navbar1 onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="dashboard-layout">
                <Sidebar isOpen={sidebarOpen} />
                <div className="profile-container">
                    <section className="profile-header">
                        <div className="profile-avatar-large">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-info">
                            <h1>{user.name}</h1>
                            <p className="profile-email">{user.email}</p>
                            <span className="profile-tag">🎓 Computer Science Student</span>
                        </div>
                    </section>

                    <section className="profile-skills-section">
                        <div className="skills-header">
                            <h2>My Published Skills</h2>
                            <button className="add-skill-btn" onClick={() => navigate("/add-skill")}>
                                + Add New Skill
                            </button>
                        </div>

                        {loading ? (
                            <p>Loading your skills...</p>
                        ) : mySkills.length > 0 ? (
                            <div className="skills-grid">
                                {mySkills.map(skill => (
                                    <SkillCard
                                        key={skill.id}
                                        title={skill.name}
                                        category={skill.category}
                                        students="0 students"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="no-skills">
                                <p>You haven't added any skills yet.</p>
                                <button className="outline-btn" onClick={() => navigate("/add-skill")}>
                                    Start Sharing Your Knowledge
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

export default Profile;
