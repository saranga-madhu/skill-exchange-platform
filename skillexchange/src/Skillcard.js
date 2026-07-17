function SkillCard({ title, category, students, onEdit }) {
  return (
    <div className="skill-card">
      <div className="skill-card-content">
        <h3>{title}</h3>
        <span className="tag">{category}</span>
        <p>{students}</p>
      </div>
      {onEdit && (
        <button className="edit-skill-btn" onClick={onEdit}>Edit</button>
      )}
    </div>
  );
}

export default SkillCard;
