function SkillCard({ title, category, type, onEdit }) {
  const isLearning = type === "wanted";
  const label = isLearning ? "Learning" : "Teaching";
  const badgeClass = isLearning ? "type-badge type-learning" : "type-badge type-teaching";
  const icon = isLearning ? "📖" : "🎓";

  return (
    <div className={`skill-card ${isLearning ? "skill-card-learning" : "skill-card-teaching"}`}>
      <div className="skill-card-content">
        <h3>{title}</h3>
        <span className="tag">{category}</span>
        <span className={badgeClass}>
          {icon} {label}
        </span>
      </div>
      {onEdit && (
        <button className="edit-skill-btn" onClick={onEdit}>Edit</button>
      )}
    </div>
  );
}

export default SkillCard;
