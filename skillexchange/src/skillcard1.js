import { useNavigate } from 'react-router-dom';

function SkillCard({ skill, onRequest }) {
  const navigate = useNavigate();
  const categoryColors = {
    IT: "bg-it",
    Music: "bg-music",
    Language: "bg-language",
    Design: "bg-design",
    Others: "bg-others",
  };

  const getCategoryClass = (category) => {
    return categoryColors[category] || "bg-others";
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star-filled">&#9733;</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star-half">&#9733;</span>); // Simplified for now
      } else {
        stars.push(<span key={i} className="star-empty">&#9734;</span>);
      }
    }
    return stars;
  };

  return (
    <div className="skill-card">
      <div className={`category-tag ${getCategoryClass(skill.category)}`}>
        {skill.category}
      </div>
      <h3>{skill.title}</h3>
      <p>{skill.teacher}</p>

      <div className="rating-display">
        {renderStars(skill.average_rating)}
        <span className="rating-text">({skill.average_rating ? Number(skill.average_rating).toFixed(1) : "No ratings"})</span>
      </div>

      <p><b>Level:</b> {skill.level || "Beginner"}</p>

      <div className="card-actions">
        <button className="request-btn" onClick={() => onRequest(skill)}>Request Skill</button>
        <button
          className="feedback-btn"
          onClick={() => navigate(`/feedback/${skill.id}`, {
            state: {
              skillName: skill.title,
              teacherName: skill.teacher,
              receiverId: skill.user_id
            }
          })}
        >
          Give Feedback
        </button>
      </div>
    </div>
  );
}

export default SkillCard;
