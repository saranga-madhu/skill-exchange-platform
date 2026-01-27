import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar1 from "./Navbar1";
import Sidebar from "./Sidebar";
import "./Dashboard.css"; // Reuse dashboard styles for layout
import { API_URL, getAuthHeaders } from "./api";

function AddSkill() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newSkill, setNewSkill] = useState({
        name: "",
        category: "IT",
        description: "",
        type: "offered"
    });

    const handleAddSkill = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/skills`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders()
                },
                body: JSON.stringify(newSkill)
            });

            if (response.ok) {
                alert("Skill added successfully!");
                navigate("/dashboard");
            } else {
                alert("Failed to add skill");
            }
        } catch (error) {
            console.error("Error adding skill:", error);
        }
    };

    return (
        <>
            <Navbar1 onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            <div className="dashboard-layout">
                <Sidebar isOpen={sidebarOpen} />

                <div className="dashboard-content">
                    <h1 className="dashboard-title">Add New Skill</h1>
                    <p className="dashboard-subtitle">Share your knowledge with others</p>

                    <div className="skill-card" style={{ maxWidth: "600px", background: "white", marginTop: "20px" }}>
                        <form onSubmit={handleAddSkill} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Skill Name</label>
                                <input
                                    type="text"
                                    required
                                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    placeholder="e.g., Python Programming"
                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Category</label>
                                <select
                                    value={newSkill.category}
                                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                >
                                    <option value="IT">IT</option>
                                    <option value="Music">Music</option>
                                    <option value="Language">Language</option>
                                    <option value="Design">Design</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Art">Art</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Description</label>
                                <textarea
                                    value={newSkill.description}
                                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", minHeight: "100px" }}
                                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                                    placeholder="Describe what you can teach..."
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#f0f0f0", cursor: "pointer" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #8b2cf5, #ec4899)", color: "white", cursor: "pointer" }}
                                >
                                    Save Skill
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddSkill;
