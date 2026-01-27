function SkillCard({ title, category, students }) {
  return (
    <div className="skill-card">
      <h3>{title}</h3>
      <span className="tag">{category}</span>
      <p>{students}</p>
    </div>
  );
}

export default SkillCard;
