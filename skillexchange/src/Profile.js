import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return (
            <div className="profile-page">
                <p>No user logged in.</p>
                <button onClick={() => navigate("/login")}>Go to Login</button>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <h2>{user.name}'s Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Education:</strong> Computer Science</p>
            {/* Add more details as needed */}
        </div>
    );
}

export default Profile;
