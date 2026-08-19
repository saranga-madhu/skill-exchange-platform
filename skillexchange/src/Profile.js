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
    const [editEmail, setEditEmail] = useState(user?.email || "");
    const [editEducation, setEditEducation] = useState(user?.education_level || "");
    const [editUniversity, setEditUniversity] = useState(user?.university || "");
    const [editPhoto, setEditPhoto] = useState(user?.photo || "");
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
                    setEditEmail(data.email || "");
                    setEditEducation(data.education_level);
                    setEditUniversity(data.university || "");
                    setEditPhoto(data.photo || "");
                    // Update local storage if needed
                    const updatedUser = {
                        ...user,
                        name: data.name,
                        email: data.email,
                        degree: data.education_level,
                        university: data.university,
                        photo: data.photo
                    };
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
                body: JSON.stringify({
                    name: editName,
                    email: editEmail,
                    education_level: editEducation,
                    university: editUniversity,
                    photo: editPhoto
                })
            });

            if (response.ok) {
                const updatedUser = {
                    ...user,
                    name: editName,
                    email: editEmail,
                    education_level: editEducation,
                    degree: editEducation,         // keep both for display compatibility
                    university: editUniversity,
                    photo: editPhoto
                };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                window.dispatchEvent(new Event("userUpdated"));
                setIsEditingProfile(false);
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger file input click
    const handleCameraClick = () => {
        const fileInput = document.getElementById("profile-photo-upload");
        if (fileInput) fileInput.click();
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
                    <section className="profile-card-modern">

                        <div className="profile-header-titles">
                            <h2>Edit Your Profile</h2>
                            <p>Update your personal information and keep your profile up to date.</p>
                        </div>

                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar-centered">
                                {editPhoto || user.photo ? (
                                    <img src={editPhoto || user.photo} alt="Profile" className="avatar-img" />
                                ) : (
                                    <div className="avatar-initials">{user.name.charAt(0).toUpperCase()}</div>
                                )}

                                {isEditingProfile && (
                                    <div className="camera-icon-wrapper" onClick={handleCameraClick} title="Upload Photo">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="white" stroke="none">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                            <circle cx="12" cy="13" r="4"></circle>
                                        </svg>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="profile-photo-upload"
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    style={{ display: "none" }}
                                    onChange={handlePhotoUpload}
                                />
                            </div>
                        </div>

                        <div className="profile-content-container">
                            {!isEditingProfile ? (
                                <div className="profile-view-mode">
                                    <h1>{user.name}</h1>
                                    <p className="profile-email-main">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: '-3px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        {user.email}
                                    </p>
                                    <div className="profile-academic-tags">
                                        {user.university && <span className="profile-tag uni-tag">🏛️ {user.university}</span>}
                                        {user.degree && <span className="profile-tag degree-tag">🎓 {user.degree}</span>}
                                        {!user.degree && user.education_level && <span className="profile-tag degree-tag">🎓 {user.education_level}</span>}
                                    </div>
                                    <button className="edit-profile-btn-modern" onClick={() => setIsEditingProfile(true)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: '-3px' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        Edit Profile
                                    </button>
                                </div>
                            ) : (
                                <form className="profile-edit-modern-form" onSubmit={handleUpdateProfile}>
                                    <div className="two-column-form">
                                        <div className="form-group-modern">
                                            <label>Full Name</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group-modern">
                                            <label>University</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                                <input
                                                    type="text"
                                                    value={editUniversity}
                                                    onChange={(e) => setEditUniversity(e.target.value)}
                                                    placeholder="e.g. Harvard University"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group-modern">
                                            <label>Email Address</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                                <input
                                                    type="email"
                                                    value={editEmail}
                                                    onChange={(e) => setEditEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group-modern">
                                            <label>Degree</label>
                                            <div className="input-wrapper">
                                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                                                <input
                                                    type="text"
                                                    value={editEducation}
                                                    onChange={(e) => setEditEducation(e.target.value)}
                                                    placeholder="e.g. B.Sc. Computer Science"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions-modern">
                                        <button type="button" className="cancel-btn-modern" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                                        <button type="submit" className="save-btn-modern">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: '-3px' }}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                            Save Changes
                                        </button>
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
                                        type={skill.type}
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
