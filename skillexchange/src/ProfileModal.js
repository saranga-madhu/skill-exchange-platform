import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileModal.css";

function ProfileModal({ onClose }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content">
                    <p>No user logged in.</p>
                    <button onClick={() => navigate("/login")}>Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{user.name}'s Profile</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Education:</strong> Computer Science</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default ProfileModal;
