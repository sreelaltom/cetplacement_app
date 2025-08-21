import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../styles/theme";

const Profile = () => {
  const { user, userProfile, updateProfile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    branch: "",
    year: 1,
    bio: "",
    skills: "",
    linkedin_url: "",
    github_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const branches = [
    "Computer Science Engineering",
    "Information Technology",
    "Electronics and Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Other",
  ];

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || "",
        branch: userProfile.branch || "",
        year: userProfile.year || 1,
        bio: userProfile.bio || "",
        skills: userProfile.skills || "",
        linkedin_url: userProfile.linkedin_url || "",
        github_url: userProfile.github_url || "",
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await updateProfile(formData);

      if (error) {
        setMessage({
          type: "error",
          text: "Failed to update profile. Please try again.",
        });
      } else {
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
          padding: theme.spacing.md,
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
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        minHeight: "100vh",
        padding: theme.spacing.md,
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: theme.spacing.xl,
          [`@media (max-width: ${theme.breakpoints.tablet})`]: {
            padding: theme.spacing.md,
          },
        }}
      >
        {/* Profile Header Card */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            boxShadow: theme.shadows.lg,
            overflow: "hidden",
            marginBottom: theme.spacing.xl,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 100%)`,
              color: theme.colors.textWhite,
              padding: theme.spacing.xl,
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Profile Avatar */}
            <div
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: `0 auto ${theme.spacing.lg}`,
                fontSize: theme.typography.fontSize["4xl"],
                border: "4px solid rgba(255,255,255,0.3)",
                boxShadow: theme.shadows.lg,
                fontWeight: theme.typography.fontWeight.bold,
              }}
            >
              {userProfile?.full_name?.[0]?.toUpperCase() ||
                user?.email?.[0]?.toUpperCase() ||
                "👤"}
            </div>

            {/* Profile Info */}
            <h1
              style={{
                fontSize:
                  window.innerWidth < 768
                    ? theme.typography.fontSize["2xl"]
                    : theme.typography.fontSize["3xl"],
                fontWeight: theme.typography.fontWeight.bold,
                margin: `0 0 ${theme.spacing.sm} 0`,
                lineHeight: theme.typography.lineHeight.tight,
              }}
            >
              {userProfile?.full_name || user?.email?.split("@")[0]}
            </h1>
            <p
              style={{
                opacity: 0.9,
                margin: `0 0 ${theme.spacing.md} 0`,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              {user?.email}
            </p>
            {userProfile?.branch && (
              <div
                style={{
                  marginTop: theme.spacing.lg,
                  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: theme.borderRadius.full,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                📚 {userProfile.branch} - Year {userProfile.year} | ⭐{" "}
                {userProfile.points || 0} points
              </div>
            )}
          </div>

          {/* Profile Stats */}
          <div
            style={{
              padding: theme.spacing.xl,
              borderBottom: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.surface,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  window.innerWidth < 768
                    ? "1fr"
                    : "repeat(auto-fit, minmax(180px, 1fr))",
                gap: theme.spacing.lg,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.lg,
                  border: `2px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.fontSize["2xl"],
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  ⭐ {userProfile?.points || 0}
                </div>
                <div
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  Points Earned
                </div>
              </div>

              <div
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.lg,
                  border: `2px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.fontSize["2xl"],
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.accent,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  📝 {userProfile?.posts_count || 0}
                </div>
                <div
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  Posts Shared
                </div>
              </div>

              <div
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.lg,
                  border: `2px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.fontSize["2xl"],
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.secondary,
                  }}
                >
                  💼 {userProfile?.experiences_count || 0}
                </div>
                <div
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  Experiences
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.shadows.lg,
              padding: theme.spacing.xl,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.md,
                marginBottom: theme.spacing.xl,
              }}
            >
              <div
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.md,
                  color: theme.colors.textWhite,
                  fontSize: theme.typography.fontSize.lg,
                }}
              >
                ⚙️
              </div>
              <h2
                style={{
                  fontSize:
                    window.innerWidth < 768
                      ? theme.typography.fontSize.xl
                      : theme.typography.fontSize["2xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text,
                  margin: 0,
                }}
              >
                Edit Profile
              </h2>
            </div>

            {message.text && (
              <div
                style={{
                  padding: theme.spacing.lg,
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.spacing.xl,
                  backgroundColor:
                    message.type === "success"
                      ? theme.colors.accentLight
                      : "rgba(239, 68, 68, 0.1)",
                  color:
                    message.type === "success"
                      ? theme.colors.accent
                      : theme.colors.error,
                  border: `2px solid ${
                    message.type === "success"
                      ? theme.colors.accent
                      : theme.colors.error
                  }`,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                {message.text}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "grid", gap: theme.spacing.lg }}
            >
              {/* Full Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: theme.typography.fontWeight.semibold,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.base,
                  }}
                >
                  👤 Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  style={{
                    ...(theme.commonStyles?.input || {
                      width: "100%",
                      padding: theme.spacing.md,
                      border: `2px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.base,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      boxSizing: "border-box",
                      transition: theme.transitions.normal,
                    }),
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.colors.border;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Branch and Year */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    window.innerWidth < 768 ? "1fr" : "2fr 1fr",
                  gap: theme.spacing.lg,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: theme.typography.fontWeight.semibold,
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.base,
                    }}
                  >
                    📚 Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: theme.spacing.md,
                      border: `2px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.base,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      boxSizing: "border-box",
                      transition: theme.transitions.normal,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.border;
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: theme.typography.fontWeight.semibold,
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.base,
                    }}
                  >
                    🎓 Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: theme.spacing.md,
                      border: `2px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.base,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      boxSizing: "border-box",
                      transition: theme.transitions.normal,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.border;
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: theme.typography.fontWeight.semibold,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.base,
                  }}
                >
                  📝 Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  style={{
                    width: "100%",
                    padding: theme.spacing.md,
                    border: `2px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.base,
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    resize: "vertical",
                    boxSizing: "border-box",
                    transition: theme.transitions.normal,
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.colors.border;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Skills */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: theme.typography.fontWeight.semibold,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.base,
                  }}
                >
                  💻 Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., Python, Java, React, Machine Learning"
                  style={{
                    width: "100%",
                    padding: theme.spacing.md,
                    border: `2px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.base,
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    boxSizing: "border-box",
                    transition: theme.transitions.normal,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.colors.border;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Social Links */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    window.innerWidth < 768 ? "1fr" : "1fr 1fr",
                  gap: theme.spacing.lg,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: theme.typography.fontWeight.semibold,
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.base,
                    }}
                  >
                    🔗 LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    style={{
                      width: "100%",
                      padding: theme.spacing.md,
                      border: `2px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.base,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      boxSizing: "border-box",
                      transition: theme.transitions.normal,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: theme.typography.fontWeight.semibold,
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSize.base,
                    }}
                  >
                    🐙 GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                    style={{
                      width: "100%",
                      padding: theme.spacing.md,
                      border: `2px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.base,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      boxSizing: "border-box",
                      transition: theme.transitions.normal,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primaryLight}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...(theme.commonStyles?.button?.primary || {
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.textWhite,
                    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                    border: "none",
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.semibold,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: theme.transitions.normal,
                  }),
                  opacity: loading ? 0.5 : 1,
                  justifySelf: "start",
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    e.target.style.backgroundColor = theme.colors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  if (!loading)
                    e.target.style.backgroundColor = theme.colors.primary;
                }}
              >
                {loading ? "⏳ Updating..." : "💾 Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Profile;
