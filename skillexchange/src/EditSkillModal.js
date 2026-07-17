import React, { useState } from 'react';
import { API_URL, getAuthHeaders } from './api';
import './EditSkillModal.css';

function EditSkillModal({ skill, onClose, onUpdate }) {
    const [name, setName] = useState(skill.name);
    const [category, setCategory] = useState(skill.category);
    const [description, setDescription] = useState(skill.description);
    const [type, setType] = useState(skill.type);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/skills/${skill.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ name, category, description, type })
            });

            if (response.ok) {
                onUpdate();
                onClose();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to update skill');
            }
        } catch (error) {
            console.error('Error updating skill:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Skill</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Skill Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="IT">IT</option>
                            <option value="Music">Music</option>
                            <option value="Language">Language</option>
                            <option value="Design">Design</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="offered">I can teach this</option>
                            <option value="wanted">I want to learn this</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditSkillModal;
