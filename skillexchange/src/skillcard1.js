function SkillCard({ skill, onRequest }) {
  const categoryColors = {
    IT: "bg-it",
    Music: "bg-music",
    Language: "bg-language",
    Design: "bg-design",
  };

  return (
    <div className="skill-card">
      <div className={`category-tag ${categoryColors[skill.category]}`}>
        {skill.category}
      </div>
      <h3>{skill.title}</h3>
      <p>{skill.teacher}</p>
      <p><b>Level:</b> {skill.level || "Beginner"}</p>
      <button className="request-btn" onClick={() => onRequest(skill)}>Request Skill</button>
    </div>
  );
}

export default SkillCard;
