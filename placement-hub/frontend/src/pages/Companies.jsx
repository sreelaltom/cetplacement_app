import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../services/api";
import { theme } from "../styles/theme";

// Add CSS animation for loading spinner
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

const Companies = () => {
  // Fetch interview experiences and update state
  const fetchInterviewExperiences = async () => {
    try {
      const experiencesResponse = await apiService.getInterviewExperiences();
      if (experiencesResponse.data) {
        const experiencesData =
          experiencesResponse.data.results || experiencesResponse.data;
        setInterviewExperiences(
          Array.isArray(experiencesData) ? experiencesData : []
        );
      }
    } catch (error) {
      console.error("Error fetching interview experiences:", error);
    }
  };

  // Like handler for experiences
  const handleLikeExperience = async (experienceId) => {
    try {
      await apiService.voteOnExperience(experienceId, true);
      fetchInterviewExperiences(); // Refresh list after voting
    } catch (error) {
      console.error("Error liking experience:", error);
    }
  };
  const [companies, setCompanies] = useState([]);
  const [interviewExperiences, setInterviewExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState("companies"); // "companies" or "experiences"
  const [showPostForm, setShowPostForm] = useState(false);
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    interview_date: "",
    rounds: "",
    questions: "",
    tips: "",
    difficulty_level: 2,
    result: "pending",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const companiesResponse = await apiService.getCompanies();
        setCompanies(companiesResponse.data || []);

        const experiencesResponse = await apiService.getInterviewExperiences();
        if (experiencesResponse.data) {
          // Handle both paginated and non-paginated responses
          const experiencesData =
            experiencesResponse.data.results || experiencesResponse.data;
          setInterviewExperiences(
            Array.isArray(experiencesData) ? experiencesData : []
          );
        }
      } catch (error) {
        console.error("Error fetching companies or experiences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCompanies(companies);
    } else {
      setFilteredCompanies(
        companies.filter((company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, companies]);

  const handlePostExperience = async (e) => {
    e.preventDefault();
    try {
      await apiService.createInterviewExperience(newExperience);
      setShowPostForm(false);
      setNewExperience({
        company: "",
        position: "",
        interview_date: "",
        rounds: "",
        questions: "",
        tips: "",
        difficulty_level: 2,
        result: "pending",
      });
      fetchInterviewExperiences(); // Refresh the list
    } catch (error) {
      console.error("Error posting experience:", error);
      alert("Error posting experience. Please try again.");
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 1:
        return "#22c55e"; // Easy - Green
      case 2:
        return "#f59e0b"; // Medium - Orange
      case 3:
        return "#ef4444"; // Hard - Red
      default:
        return theme.colors.textSecondary;
    }
  };

  const getDifficultyText = (level) => {
    switch (level) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Unknown";
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "selected":
        return "#22c55e";
      case "rejected":
        return "#ef4444";
      case "pending":
        return "#f59e0b";
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCompanyIcon = (company) => {
    const name = company.name.toLowerCase();
    if (name.includes("google")) return "🔍";
    if (name.includes("microsoft")) return "🖥️";
    if (name.includes("amazon")) return "📦";
    if (name.includes("apple")) return "🍎";
    if (name.includes("meta") || name.includes("facebook")) return "📘";
    if (name.includes("netflix")) return "🎬";
    if (name.includes("tesla")) return "🚗";
    if (name.includes("uber")) return "🚕";
    if (name.includes("airbnb")) return "🏠";
    if (name.includes("spotify")) return "🎵";
    return "🏢";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: theme.spacing.xxl }}>
        <p
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          Loading companies...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <h1
            style={{
              fontSize: theme.typography.fontSize.h1,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text,
              margin: `0 0 ${theme.spacing.md} 0`,
              textAlign: "center",
            }}
          >
            🏢 Companies & Interview Experiences
          </h1>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.lg,
              margin: `0 0 ${theme.spacing.xl} 0`,
              textAlign: "center",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Explore top companies and share your interview experiences
          </p>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: theme.spacing.md,
              marginBottom: theme.spacing.lg,
            }}
          >
            <button
              onClick={() => setActiveTab("companies")}
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                borderRadius: theme.borderRadius.lg,
                border: `2px solid ${
                  activeTab === "companies"
                    ? theme.colors.primary
                    : theme.colors.border
                }`,
                backgroundColor:
                  activeTab === "companies"
                    ? theme.colors.primary
                    : "transparent",
                color: activeTab === "companies" ? "white" : theme.colors.text,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              📋 Companies List
            </button>
            <button
              onClick={() => setActiveTab("experiences")}
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                borderRadius: theme.borderRadius.lg,
                border: `2px solid ${
                  activeTab === "experiences"
                    ? theme.colors.primary
                    : theme.colors.border
                }`,
                backgroundColor:
                  activeTab === "experiences"
                    ? theme.colors.primary
                    : "transparent",
                color:
                  activeTab === "experiences" ? "white" : theme.colors.text,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              💬 Interview Experiences
            </button>
          </div>

          {/* Post Experience Button - Only show on experiences tab */}
          {activeTab === "experiences" && (
            <div
              style={{ textAlign: "center", marginBottom: theme.spacing.lg }}
            >
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                style={{
                  padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                  borderRadius: theme.borderRadius.lg,
                  border: "none",
                  backgroundColor: theme.colors.success,
                  color: "white",
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.semibold,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(34, 197, 94, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                ✍️ {showPostForm ? "Cancel" : "Share Your Experience"}
              </button>
            </div>
          )}
        </div>

        {/* Search Bar - Only for companies tab */}
        {activeTab === "companies" && (
          <div style={{ marginBottom: theme.spacing.xl }}>
            <input
              type="text"
              placeholder="Search companies by name or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: theme.spacing.lg,
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.fontSize.base,
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                outline: "none",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        )}

        {/* Post Experience Form */}
        {showPostForm && activeTab === "experiences" && (
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.xl,
              border: `1px solid ${theme.colors.border}`,
              marginBottom: theme.spacing.xl,
            }}
          >
            <h3
              style={{
                margin: `0 0 ${theme.spacing.lg} 0`,
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
              }}
            >
              Share Your Interview Experience
            </h3>

            <form onSubmit={handlePostExperience}>
              <div style={{ display: "grid", gap: theme.spacing.lg }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: theme.spacing.lg,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: theme.spacing.sm,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      Company *
                    </label>
                    <select
                      value={newExperience.company}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          company: e.target.value,
                        })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: theme.spacing.md,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.base,
                      }}
                    >
                      <option value="">Select a company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: theme.spacing.sm,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      Position *
                    </label>
                    <input
                      type="text"
                      value={newExperience.position}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          position: e.target.value,
                        })
                      }
                      placeholder="e.g., Software Developer, Data Analyst"
                      required
                      style={{
                        width: "100%",
                        padding: theme.spacing.md,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.base,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: theme.spacing.lg,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: theme.spacing.sm,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      Interview Date *
                    </label>
                    <input
                      type="date"
                      value={newExperience.interview_date}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          interview_date: e.target.value,
                        })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: theme.spacing.md,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.base,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: theme.spacing.sm,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      Difficulty Level
                    </label>
                    <select
                      value={newExperience.difficulty_level}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          difficulty_level: parseInt(e.target.value),
                        })
                      }
                      style={{
                        width: "100%",
                        padding: theme.spacing.md,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.base,
                      }}
                    >
                      <option value={1}>Easy</option>
                      <option value={2}>Medium</option>
                      <option value={3}>Hard</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: theme.spacing.lg,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: theme.spacing.sm,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      Result
                    </label>
                    <select
                      value={newExperience.result}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          result: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: theme.spacing.md,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.base,
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold,
                    }}
                  >
                    Interview Rounds *
                  </label>
                  <textarea
                    value={newExperience.rounds}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        rounds: e.target.value,
                      })
                    }
                    placeholder="Describe the interview rounds (e.g., Round 1: Online Test, Round 2: Technical Interview...)"
                    required
                    rows={4}
                    style={{
                      width: "100%",
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.base,
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold,
                    }}
                  >
                    Questions Asked *
                  </label>
                  <textarea
                    value={newExperience.questions}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        questions: e.target.value,
                      })
                    }
                    placeholder="List the questions asked during the interview..."
                    required
                    rows={4}
                    style={{
                      width: "100%",
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.base,
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold,
                    }}
                  >
                    Tips & Advice
                  </label>
                  <textarea
                    value={newExperience.tips}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        tips: e.target.value,
                      })
                    }
                    placeholder="Share your tips and advice for future candidates..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.base,
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: theme.spacing.md,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    style={{
                      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.border}`,
                      backgroundColor: "transparent",
                      color: theme.colors.text,
                      cursor: "pointer",
                      fontSize: theme.typography.fontSize.base,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                      borderRadius: theme.borderRadius.md,
                      border: "none",
                      backgroundColor: theme.colors.primary,
                      color: "white",
                      cursor: "pointer",
                      fontSize: theme.typography.fontSize.base,
                      fontWeight: theme.typography.fontWeight.semibold,
                    }}
                  >
                    Share Experience
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === "companies" ? (
          filteredCompanies.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: theme.spacing.xxl,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <h3
                style={{
                  color: theme.colors.textSecondary,
                  margin: `0 0 ${theme.spacing.lg} 0`,
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                {searchTerm ? "No companies found" : "No companies available"}
              </h3>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  margin: 0,
                  fontSize: theme.typography.fontSize.base,
                }}
              >
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Companies will appear here as they are added"}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: theme.spacing.xl,
              }}
            >
              {filteredCompanies.map((company) => (
                <div key={company.id}>
                  <Link
                    to={`/company/${company.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing.xl,
                        border: `1px solid ${theme.colors.border}`,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        height: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 8px 25px ${theme.colors.primary}20`;
                        e.currentTarget.style.borderColor =
                          theme.colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = theme.colors.border;
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: theme.spacing.lg,
                          marginBottom: theme.spacing.lg,
                        }}
                      >
                        <span
                          style={{ fontSize: theme.typography.fontSize.h2 }}
                        >
                          {getCompanyIcon(company)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              margin: `0 0 ${theme.spacing.xs} 0`,
                              color: theme.colors.text,
                              fontSize: theme.typography.fontSize.xl,
                              fontWeight: theme.typography.fontWeight.bold,
                            }}
                          >
                            {company.name}
                          </h3>
                          {(company.tier || company.salary_range) && (
                            <p
                              style={{
                                margin: 0,
                                color: theme.colors.textSecondary,
                                fontSize: theme.typography.fontSize.sm,
                                fontWeight: theme.typography.fontWeight.medium,
                              }}
                            >
                              {company.tier && company.salary_range
                                ? `${company.tier
                                    .replace("_", " ")
                                    .replace(/\b\w/g, (l) =>
                                      l.toUpperCase()
                                    )} • ${company.salary_range}`
                                : company.tier
                                    ?.replace("_", " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                                  company.salary_range}
                            </p>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.textSecondary,
                          marginTop: "auto",
                          paddingTop: theme.spacing.md,
                          borderTop: `1px solid ${theme.colors.border}`,
                        }}
                      >
                        <span>Click to view details</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                  {company.website && (
                    <div
                      style={{
                        marginBottom: theme.spacing.lg,
                        marginTop: theme.spacing.sm,
                      }}
                    >
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.colors.primary,
                          textDecoration: "none",
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                        }}
                      >
                        🌐 Visit Website
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : interviewExperiences.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: theme.spacing.xxl,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <h3
              style={{
                color: theme.colors.textSecondary,
                margin: `0 0 ${theme.spacing.lg} 0`,
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
              }}
            >
              No interview experiences yet
            </h3>
            <p
              style={{
                color: theme.colors.textSecondary,
                margin: 0,
                fontSize: theme.typography.fontSize.base,
              }}
            >
              Be the first to share your interview experience!
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: theme.spacing.xl }}>
            {interviewExperiences.map((experience) => (
              <div
                key={experience.id}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.xl,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: theme.spacing.lg,
                    flexWrap: "wrap",
                    gap: theme.spacing.md,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: `0 0 ${theme.spacing.xs} 0`,
                        color: theme.colors.text,
                        fontSize: theme.typography.fontSize.xl,
                        fontWeight: theme.typography.fontWeight.bold,
                      }}
                    >
                      {experience.company_name} - {experience.position}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.sm,
                      }}
                    >
                      {experience.interview_date &&
                        formatDate(experience.interview_date)}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: theme.spacing.md,
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: getDifficultyColor(
                          experience.difficulty_level
                        ),
                        color: "white",
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      {getDifficultyText(experience.difficulty_level)}
                    </span>
                    <span
                      style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: getResultColor(experience.result),
                        color: "white",
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        textTransform: "capitalize",
                      }}
                    >
                      {experience.result}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ display: "grid", gap: theme.spacing.lg }}>
                  {experience.rounds && (
                    <div>
                      <h4
                        style={{
                          margin: `0 0 ${theme.spacing.sm} 0`,
                          color: theme.colors.text,
                          fontSize: theme.typography.fontSize.lg,
                          fontWeight: theme.typography.fontWeight.semibold,
                        }}
                      >
                        📋 Interview Rounds
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          color: theme.colors.text,
                          fontSize: theme.typography.fontSize.base,
                          lineHeight: "1.6",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {experience.rounds}
                      </p>
                    </div>
                  )}

                  {experience.questions && (
                    <div>
                      <h4
                        style={{
                          margin: `0 0 ${theme.spacing.sm} 0`,
                          color: theme.colors.text,
                          fontSize: theme.typography.fontSize.lg,
                          fontWeight: theme.typography.fontWeight.semibold,
                        }}
                      >
                        ❓ Questions Asked
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          color: theme.colors.text,
                          fontSize: theme.typography.fontSize.base,
                          lineHeight: "1.6",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {experience.questions}
                      </p>
                    </div>
                  )}

                  {experience.tips && (
                    <div>
                      <h4
                        style={{
                          margin: `0 0 ${theme.spacing.sm} 0`,
                          color: theme.colors.text,
                          fontSize: theme.typography.fontSize.lg,
                          fontWeight: theme.typography.fontWeight.semibold,
                        }}
                      >
                        💡 Tips & Advice
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          color: theme.colors.text,
                          fontSize: theme.typography.fontSize.base,
                          lineHeight: "1.6",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {experience.tips}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer - Like button styled like CompanyPage */}
                <div
                  style={{
                    marginTop: theme.spacing.lg,
                    paddingTop: theme.spacing.md,
                    borderTop: `1px solid ${theme.colors.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.textSecondary,
                  }}
                >
                  <span>
                    Posted by {experience.posted_by_name || "Anonymous"} •{" "}
                    {experience.created_at && formatDate(experience.created_at)}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.md,
                    }}
                  >
                    <button
                      onClick={() => handleLikeExperience(experience.id)}
                      style={{
                        backgroundColor: experience.user_voted
                          ? theme.colors.error
                          : "transparent",
                        border: "none",
                        cursor: experience.user_voted ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing.xs,
                        color: experience.user_voted
                          ? theme.colors.textWhite
                          : theme.colors.error,
                        fontSize: theme.typography.fontSize.sm,
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        borderRadius: theme.borderRadius.md,
                        transition: "all 0.2s ease",
                      }}
                      disabled={experience.user_voted}
                      title={experience.user_voted ? "You liked this" : "Like"}
                      onMouseEnter={(e) => {
                        if (!experience.user_voted) {
                          e.target.style.backgroundColor = theme.colors.error;
                          e.target.style.color = theme.colors.textWhite;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!experience.user_voted) {
                          e.target.style.backgroundColor = "none";
                          e.target.style.color = theme.colors.error;
                        }
                      }}
                    >
                      {experience.user_voted ? "❤️" : "🤍"}{" "}
                      {experience.upvotes || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
