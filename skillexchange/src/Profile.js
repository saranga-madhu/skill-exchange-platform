import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar1 from "./Navbar1";
import Sidebar from "./Sidebar";
import SkillCard from "./Skillcard";
import EditSkillModal from "./EditSkillModal";
import { API_URL, getAuthHeaders } from "./api";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mySkills, setMySkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(user?.name || "");
    const [editEducation, setEditEducation] = useState(user?.education_level || "University Student");
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${API_URL}/auth/profile`, {
                    headers: getAuthHeaders()
                });
                if (response.ok) {
                    const data = await response.json();
                    setEditName(data.name);
                    setEditEducation(data.education_level);
                    // Update local storage if needed
                    const updatedUser = { ...user, name: data.name, education_level: data.education_level };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

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

        fetchProfileData();
        fetchMySkills();
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ name: editName, education_level: editEducation })
            });

            if (response.ok) {
                const updatedUser = { ...user, name: editName, education_level: editEducation };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setIsEditingProfile(false);
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleEditSkill = (skill) => {
        setSelectedSkill(skill);
        setIsSkillModalOpen(true);
    };

    const refreshSkills = async () => {
        setLoading(true);
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
                        <div className="profile-info-container">
                            {!isEditingProfile ? (
                                <div className="profile-info">
                                    <h1>{user.name}</h1>
                                    <p className="profile-email">{user.email}</p>
                                    <span className="profile-tag">🎓 {user.education_level || "University Student"}</span>
                                    <button className="edit-profile-toggle" onClick={() => setIsEditingProfile(true)}>
                                        Edit Profile
                                    </button>
                                </div>
                            ) : (
                                <form className="profile-edit-form" onSubmit={handleUpdateProfile}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Education Level</label>
                                        <input
                                            type="text"
                                            value={editEducation}
                                            onChange={(e) => setEditEducation(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="cancel-btn" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                                        <button type="submit" className="save-btn">Save</button>
                                    </div>
                                </form>
                            )}
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
                                        students={skill.type === 'offered' ? "Teaching" : "Learning"}
                                        onEdit={() => handleEditSkill(skill)}
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
            {isSkillModalOpen && (
                <EditSkillModal
                    skill={selectedSkill}
                    onClose={() => setIsSkillModalOpen(false)}
                    onUpdate={refreshSkills}
                />
            )}
        </>
    );
}

export default Profile;
