function Categories({ selectedCategory, setSelectedCategory }) {
  const categories = ["All", "IT", "Music", "Language", "Design", "Others"];

  return (
    <div className="categories">
      {categories.map(cat => (
        <button
          key={cat}
          className={selectedCategory === cat ? "active" : ""}
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default Categories;
