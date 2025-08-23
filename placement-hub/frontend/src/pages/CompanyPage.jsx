import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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

const CompanyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newExperience, setNewExperience] = useState({
    position: "",
    rounds: "",
    questions: "",
    tips: "",
    difficulty_level: 2,
    result: "pending",
  });

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      // Fetch company details
      const companyResponse = await apiService.getCompany(id);
      if (companyResponse.data) {
        setCompany(companyResponse.data);
      }

      // Fetch company experiences
      const experiencesResponse = await apiService.getCompanyExperiences(id);
      if (experiencesResponse.data) {
        // Handle both paginated and non-paginated responses
        const experiencesData =
          experiencesResponse.data.results || experiencesResponse.data;
        setExperiences(Array.isArray(experiencesData) ? experiencesData : []);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostExperience = async (e) => {
    e.preventDefault();
    try {
      const experienceData = {
        ...newExperience,
        company: id,
      };
      await apiService.createInterviewExperience(experienceData);
      setShowPostForm(false);
      setNewExperience({
        position: "",
        rounds: "",
        questions: "",
        tips: "",
        difficulty_level: 2,
        result: "pending",
      });
      fetchCompanyData(); // Refresh the experiences
    } catch (error) {
      console.error("Error posting experience:", error);
      alert("Error posting experience. Please try again.");
    }
  };

  const handleVote = async (experienceId, isUpvote) => {
    try {
      await apiService.voteOnExperience(experienceId, isUpvote);
      // Refresh experiences to show updated vote counts
      const experiencesResponse = await apiService.getCompanyExperiences(id);
      if (experiencesResponse.data) {
        // Handle both paginated and non-paginated responses
        const experiencesData =
          experiencesResponse.data.results || experiencesResponse.data;
        setExperiences(Array.isArray(experiencesData) ? experiencesData : []);
      }
    } catch (error) {
      console.error("Error voting on experience:", error);
    }
  };

  const getCompanyIcon = (company) => {
    if (!company) return "🏢";
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
    if (name.includes("tcs")) return "💼";
    if (name.includes("infosys")) return "🌐";
    if (name.includes("wipro")) return "🔧";
    return "🏢";
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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: theme.spacing.md,
          backgroundColor: theme.colors.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: `4px solid ${theme.colors.border}`,
              borderTop: `4px solid ${theme.colors.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: `0 auto ${theme.spacing.lg}`,
            }}
          ></div>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            Loading company details...
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{ color: theme.colors.text, marginBottom: theme.spacing.lg }}
          >
            Company not found
          </h2>
          <button
            onClick={() => navigate("/companies")}
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.lg,
              border: "none",
              backgroundColor: theme.colors.primary,
              color: "white",
              cursor: "pointer",
              fontSize: theme.typography.fontSize.base,
            }}
          >
            Back to Companies
          </button>
        </div>
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
        {/* Back Button */}
        <div style={{ marginBottom: theme.spacing.lg }}>
          <Link
            to="/companies"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text,
              textDecoration: "none",
              fontSize: theme.typography.fontSize.sm,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.colors.border;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = theme.colors.surface;
            }}
          >
            ← Back to Companies
          </Link>
        </div>

        {/* Company Header */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xl,
            border: `1px solid ${theme.colors.border}`,
            marginBottom: theme.spacing.xl,
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
            <span style={{ fontSize: "4rem" }}>{getCompanyIcon(company)}</span>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  margin: `0 0 ${theme.spacing.sm} 0`,
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.h1,
                  fontWeight: theme.typography.fontWeight.bold,
                }}
              >
                {company.name}
              </h1>
              {(company.tier || company.salary_range || company.website) && (
                <div style={{ marginBottom: theme.spacing.md }}>
                  {company.tier && (
                    <p
                      style={{
                        margin: `0 0 ${theme.spacing.xs} 0`,
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      {company.tier
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  )}
                  {company.salary_range && (
                    <p
                      style={{
                        margin: `0 0 ${theme.spacing.xs} 0`,
                        color: theme.colors.success,
                        fontSize: theme.typography.fontSize.base,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      💰 {company.salary_range}
                    </p>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: theme.colors.primary,
                        textDecoration: "none",
                        fontSize: theme.typography.fontSize.base,
                        fontWeight: theme.typography.fontWeight.medium,
                        display: "inline-block",
                        marginTop: theme.spacing.xs,
                      }}
                    >
                      🌐 Visit Website
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description removed as it's not in specified fields */}

          <div
            style={{
              display: "flex",
              gap: theme.spacing.md,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Only use <a> for external links, never inside <Link> */}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.primary,
                  color: "white",
                  textDecoration: "none",
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                🌐 Visit Website
              </a>
            )}
            <span
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.background,
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              📊 {experiences.length} Interview Experience
              {experiences.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Interview Experiences Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.lg,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.h2,
              fontWeight: theme.typography.fontWeight.bold,
            }}
          >
            💬 Interview Experiences
          </h2>
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
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
              e.target.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            ✍️ {showPostForm ? "Cancel" : "Share Your Experience"}
          </button>
        </div>

        {/* Post Experience Form */}
        {showPostForm && (
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
              Share Your {company.name} Interview Experience
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

        {/* Interview Experiences List */}
        {experiences.length === 0 ? (
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
              Be the first to share your {company.name} interview experience!
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: theme.spacing.xl }}>
            {experiences.map((experience) => (
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
                      {experience.position}
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

                {/* Footer with voting */}
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
                      onClick={() => handleVote(experience.id, true)}
                      style={{
                        background:
                          experience.user_voted === true
                            ? theme.colors.success
                            : "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing.xs,
                        color:
                          experience.user_voted === true
                            ? theme.colors.textWhite
                            : theme.colors.success,
                        fontSize: theme.typography.fontSize.sm,
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        borderRadius: theme.borderRadius.md,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (experience.user_voted !== true) {
                          e.target.style.backgroundColor = theme.colors.success;
                          e.target.style.color = theme.colors.textWhite;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (experience.user_voted !== true) {
                          e.target.style.backgroundColor = "none";
                          e.target.style.color = theme.colors.success;
                        }
                      }}
                    >
                      {experience.user_voted === true ? "❤️" : "🤍"}{" "}
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

export default CompanyPage;
