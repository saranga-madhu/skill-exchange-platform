import { useState, useEffect } from "react";
import Skillcard1 from "./skillcard1";
import Navbar1 from "./Navbar1";
import Categories from "./Categories";
import "./Browseskills.css";
import { API_URL } from "./api";

function BrowseSkills() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/skills`;
        if (selectedCategory !== "All") {
          url += `?category=${selectedCategory}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // Ensure data is array (handle backend error response being object)
        if (Array.isArray(data)) {
          setSkills(data);
        } else {
          setSkills([]);
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [selectedCategory]);

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(search.toLowerCase()) ||
    (skill.description && skill.description.toLowerCase().includes(search.toLowerCase()))
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  const handleRequest = async (skill) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to request a skill");
      return;
    }

    const message = window.prompt(`Send a message to ${skill.teacher}:`, `Hi, I'd like to learn ${skill.name}`);
    if (!message) return;

    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          receiver_id: skill.user_id, // We need to ensure we have this
          skill_id: skill.id,
          message: message
        })
      });

      if (response.ok) {
        alert("Request sent successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <>
      <Navbar1 />
      <div className="browse-container">
        <h1>Browse Skills</h1>
        <p>Find students who can teach you new skills</p>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search for skills or people..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Buttons */}
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Skill Cards */}
        <div className="skills-grid">
          {loading ? (
            <p>Loading skills...</p>
          ) : filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <Skillcard1
                key={skill.id}
                skill={{ ...skill, title: skill.name, teacher: skill.user_name || "User" }}
                onRequest={handleRequest}
              />
            ))
          ) : (
            <p>No skills found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default BrowseSkills;
