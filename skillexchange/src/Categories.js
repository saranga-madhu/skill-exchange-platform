function Categories({ selectedCategory, setSelectedCategory, skills }) {
  const categories = [
    { label: "All",       icon: "🔍" },
    { label: "IT",        icon: "💻" },
    { label: "Music",     icon: "🎵" },
    { label: "Language",  icon: "🌐" },
    { label: "Design",    icon: "🎨" },
    { label: "Lifestyle", icon: "🌿" },
    { label: "Business",  icon: "💼" },
    { label: "Others",    icon: "🌟" },
  ];

  const getCount = (label) => {
    if (!skills) return null;
    if (label === "All") return skills.length;
    return skills.filter(s => s.category === label).length;
  };

  return (
    <div className="categories">
      {categories.map(({ label, icon }) => {
        const count = getCount(label);
        return (
          <button
            key={label}
            className={selectedCategory === label ? "active" : ""}
            onClick={() => setSelectedCategory(label)}
          >
            <span className="cat-icon">{icon}</span>
            {label}
            {count !== null && (
              <span className="cat-count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Categories;
