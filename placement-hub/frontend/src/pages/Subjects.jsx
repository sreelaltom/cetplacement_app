import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";

const Subjects = () => {
  const { userProfile } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const branches = [
    "All",
    "Common",
    "Computer Science Engineering",
    "Information Technology",
    "Electronics and Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    // Filter subjects based on search term and branch
    let filtered = subjects;

    if (selectedBranch !== "All") {
      if (selectedBranch === "Common") {
        filtered = filtered.filter((subject) => subject.is_common);
      } else {
        filtered = filtered.filter(
          (subject) => subject.branch === selectedBranch
        );
      }
    }

    if (searchTerm) {
      filtered = filtered.filter((subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubjects(filtered);
  }, [searchTerm, selectedBranch, subjects]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await apiService.getSubjects();
      if (response.data) {
        // Handle both paginated and non-paginated responses
        const subjectsData = response.data.results || response.data;
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectIcon = (subject) => {
    const name = subject.name.toLowerCase();
    if (name.includes("data structures") || name.includes("algorithms"))
      return "🌳";
    if (name.includes("machine learning") || name.includes("ai")) return "🤖";
    if (name.includes("database") || name.includes("sql")) return "🗄️";
    if (name.includes("web") || name.includes("frontend")) return "🌐";
    if (
      name.includes("mobile") ||
      name.includes("android") ||
      name.includes("ios")
    )
      return "📱";
    if (name.includes("network") || name.includes("security")) return "🔒";
    if (name.includes("operating") || name.includes("os")) return "💻";
    if (name.includes("compiler") || name.includes("programming")) return "⚙️";
    if (name.includes("aptitude") || name.includes("reasoning")) return "🧠";
    if (name.includes("english") || name.includes("communication")) return "📝";
    if (name.includes("mathematics") || name.includes("discrete")) return "🔢";
    if (name.includes("physics") || name.includes("circuit")) return "⚡";
    if (name.includes("chemistry") || name.includes("chemical")) return "🧪";
    if (name.includes("mechanical") || name.includes("thermal")) return "⚙️";
    if (name.includes("civil") || name.includes("structural")) return "🏗️";
    return "📚";
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #1e40af",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem",
              }}
            ></div>
            <p>Loading subjects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#f8fafc",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              margin: "0 0 0.5rem 0",
            }}
          >
            📚 All Subjects
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1.1rem", margin: 0 }}>
            Browse all available subjects across different engineering branches
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: "1",
              minWidth: "300px",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              backgroundColor: "#ffffff",
            }}
          />

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            style={{
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              backgroundColor: "#ffffff",
              minWidth: "200px",
            }}
          >
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        {/* Subjects Grid */}
        {filteredSubjects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              backgroundColor: "#ffffff",
              borderRadius: "1rem",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#6b7280", margin: "0 0 1rem 0" }}>
              No subjects found
            </h3>
            <p style={{ color: "#9ca3af", margin: 0 }}>
              Try adjusting your search terms or filter
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredSubjects.map((subject) => (
              <Link
                key={subject.id}
                to={`/subject/${encodeURIComponent(subject.name)}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    height: "160px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <span style={{ fontSize: "2rem" }}>
                        {getSubjectIcon(subject)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            margin: "0 0 0.25rem 0",
                            color: "#1f2937",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            lineHeight: "1.3",
                          }}
                        >
                          {subject.name}
                        </h3>
                        <span
                          style={{
                            backgroundColor: subject.is_common
                              ? "#10b981"
                              : "#3b82f6",
                            color: "#ffffff",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          {subject.is_common ? "Common" : subject.branch}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.85rem",
                      color: "#9ca3af",
                    }}
                  >
                    <span>{subject.posts_count || 0} posts</span>
                    <span>Click to explore →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
