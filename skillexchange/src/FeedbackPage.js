import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar1 from './Navbar1';
import { API_URL } from './api';
import './FeedbackPage.css';

function FeedbackPage() {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { skillName, teacherName, receiverId } = location.state || {};

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a rating");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Please login to give feedback");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/feedbacks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    receiver_id: receiverId,
                    skill_id: skillId,
                    rating,
                    comment
                })
            });

            if (response.ok) {
                alert("Feedback submitted successfully!");
                navigate('/browse');
            } else {
                const data = await response.json();
                alert(data.message || "Failed to submit feedback");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar1 />
            <div className="feedback-container">
                <div className="feedback-card">
                    <h1>Give Feedback</h1>
                    <p>Share your experience with <strong>{teacherName}</strong> for the skill <strong>{skillName}</strong></p>

                    <form onSubmit={handleSubmit}>
                        <div className="star-rating">
                            {[...Array(5)].map((star, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        className={ratingValue <= (hover || rating) ? "on" : "off"}
                                        onClick={() => setRating(ratingValue)}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(rating)}
                                    >
                                        <span className="star">&#9733;</span>
                                    </button>
                                );
                            })}
                        </div>

                        <textarea
                            placeholder="Write your comment here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                        />

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default FeedbackPage;
