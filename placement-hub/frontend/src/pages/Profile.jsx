import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../styles/theme";
import apiService from "../services/api";
import PostCard from "../components/PostCard";

const Profile = () => {
  console.log("Profile component is rendering!");
  const { user, userProfile, updateProfile, loading: authLoading } = useAuth();

  // If user is authenticated but no profile, show onboarding
  if (user && !userProfile && !authLoading) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.background,
          minHeight: "100vh",
          padding: theme.spacing.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.xl,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.lg,
            }}
          >
            Welcome to CET Placement Hub! 🎓
          </h2>
          <p
            style={{
              fontSize: theme.typography.fontSize.md,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.lg,
            }}
          >
            We're setting up your profile. This may take a moment for new users.
            Please refresh the page in a few seconds.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.textWhite,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.md,
              border: "none",
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [userExperiences, setUserExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // "profile", "posts", "experiences"
  const fetchUserExperiences = async () => {
    if (!userProfile?.id) return;
    setExperiencesLoading(true);
    try {
      const response = await apiService.getInterviewExperiences({
        posted_by: userProfile.id,
      });
      if (response.data) {
        const experiences = response.data.results || response.data;
        setUserExperiences(
          Array.isArray(experiences)
            ? experiences.filter((exp) => exp.posted_by === userProfile.id)
            : []
        );
      }
    } catch (error) {
      setUserExperiences([]);
    } finally {
      setExperiencesLoading(false);
    }
  };

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

  const fetchUserPosts = async () => {
    if (!userProfile?.supabase_uid) {
      console.log("No userProfile.supabase_uid available:", userProfile);
      return;
    }

    console.log("Fetching posts for user UID:", userProfile.supabase_uid);
    setPostsLoading(true);
    try {
      const response = await apiService.getPosts({
        user: userProfile.supabase_uid,
      });
      console.log("Posts API response:", response);
      if (response.data) {
        const posts = response.data.results || response.data;
        console.log("Setting user posts:", posts);
        setUserPosts(posts);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Profile useEffect triggered, userProfile:", userProfile);
    if (userProfile) {
      console.log(
        "Setting form data and fetching posts for userProfile:",
        userProfile
      );
      console.log("Current userProfile fields:", {
        bio: userProfile.bio,
        skills: userProfile.skills,
        linkedin_url: userProfile.linkedin_url,
        github_url: userProfile.github_url,
        year: userProfile.year,
      });
      setFormData({
        full_name: userProfile.full_name || "",
        branch: userProfile.branch || "",
        year: userProfile.year || 1,
        bio: userProfile.bio || "",
        skills: userProfile.skills || "",
        linkedin_url: userProfile.linkedin_url || "",
        github_url: userProfile.github_url || "",
      });

      console.log("Form data set to:", {
        full_name: userProfile.full_name || "",
        branch: userProfile.branch || "",
        year: userProfile.year || 1,
        bio: userProfile.bio || "",
        skills: userProfile.skills || "",
        linkedin_url: userProfile.linkedin_url || "",
        github_url: userProfile.github_url || "",
      });

      // Fetch user posts and experiences
      fetchUserPosts();
      fetchUserExperiences();
    } else {
      console.log("No userProfile available yet");
    }
  }, [userProfile]);

  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;
    try {
      const response = await apiService.deleteInterviewExperience(experienceId);
      if (response.error) {
        setMessage({
          type: "error",
          text: "Failed to delete experience. Please try again.",
        });
      } else {
        setUserExperiences((prev) =>
          prev.filter((exp) => exp.id !== experienceId)
        );
        setMessage({
          type: "success",
          text: "Experience deleted successfully!",
        });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while deleting the experience.",
      });
    }
  };

  const handleDeletePost = async (postId) => {
    console.log("Attempting to delete post:", postId);
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      console.log("Calling deletePost API for postId:", postId);
      const response = await apiService.deletePost(postId);
      console.log("Delete response:", response);

      if (response.error) {
        console.error("Delete failed with error:", response.error);
        setMessage({
          type: "error",
          text: "Failed to delete post. Please try again.",
        });
      } else {
        console.log("Delete successful, removing from state");
        // Remove post from local state
        setUserPosts((prev) => prev.filter((post) => post.id !== postId));
        setMessage({
          type: "success",
          text: "Post deleted successfully!",
        });
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage({
        type: "error",
        text: "An error occurred while deleting the post.",
      });
    }
  };

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
      const { data, error } = await updateProfile(formData);

      if (error) {
        setMessage({
          type: "error",
          text: "Failed to update profile. Please try again.",
        });
      } else {
        console.log("Profile update successful, received data:", data);
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
        // Refresh form data with updated profile
        if (data) {
          console.log("Updating form data with:", data);
          setFormData({
            full_name: data.full_name || "",
            branch: data.branch || "",
            year: data.year || 1,
            bio: data.bio || "",
            skills: data.skills || "",
            linkedin_url: data.linkedin_url || "",
            github_url: data.github_url || "",
          });
        }
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
              margin: "0 auto",
            }}
          />
          <p
            style={{
              marginTop: theme.spacing.md,
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.lg,
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
                fontSize: theme.typography.fontSize["3xl"],
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
              {userProfile?.branch} • {userProfile?.year}th Year
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            boxShadow: theme.shadows.lg,
            marginBottom: theme.spacing.lg,
            border: `1px solid ${theme.colors.border}`,
            padding: theme.spacing.sm,
            display: "flex",
            gap: theme.spacing.sm,
          }}
        >
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              flex: 1,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.lg,
              border: "none",
              backgroundColor:
                activeTab === "profile" ? theme.colors.primary : "transparent",
              color:
                activeTab === "profile"
                  ? theme.colors.textWhite
                  : theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            👤 Profile Info
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            style={{
              flex: 1,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.lg,
              border: "none",
              backgroundColor:
                activeTab === "posts" ? theme.colors.primary : "transparent",
              color:
                activeTab === "posts"
                  ? theme.colors.textWhite
                  : theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            📝 My Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab("experiences")}
            style={{
              flex: 1,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.lg,
              border: "none",
              backgroundColor:
                activeTab === "experiences"
                  ? theme.colors.primary
                  : "transparent",
              color:
                activeTab === "experiences"
                  ? theme.colors.textWhite
                  : theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            💬 My Experiences ({userExperiences.length})
          </button>
        </div>
        {/* Experiences Section */}
        {activeTab === "experiences" && (
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.shadows.lg,
              border: `1px solid ${theme.colors.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: theme.spacing.xl,
                borderBottom: `1px solid ${theme.colors.border}`,
                background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.primaryHover}10 100%)`,
              }}
            >
              <h3
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.textPrimary,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                💬 My Experiences
                <span
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.textWhite,
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  {userExperiences.length}
                </span>
              </h3>
            </div>
            <div style={{ padding: theme.spacing.xl }}>
              {experiencesLoading ? (
                <div style={{ textAlign: "center", padding: theme.spacing.xl }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      border: `4px solid ${theme.colors.border}`,
                      borderTop: `4px solid ${theme.colors.primary}`,
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto",
                    }}
                  />
                  <p
                    style={{
                      marginTop: theme.spacing.md,
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.md,
                    }}
                  >
                    Loading your experiences...
                  </p>
                </div>
              ) : userExperiences.length === 0 ? (
                <div style={{ textAlign: "center", padding: theme.spacing.xl }}>
                  <div
                    style={{
                      fontSize: "4rem",
                      marginBottom: theme.spacing.md,
                    }}
                  >
                    💬
                  </div>
                  <h4
                    style={{
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.textPrimary,
                      margin: `0 0 ${theme.spacing.sm} 0`,
                    }}
                  >
                    No Experiences Yet
                  </h4>
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.md,
                      margin: 0,
                    }}
                  >
                    You haven't shared any interview experiences yet.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.lg,
                  }}
                >
                  {userExperiences.map((experience) => (
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
                              new Date(
                                experience.interview_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
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
                              backgroundColor:
                                experience.difficulty_level === 1
                                  ? "#22c55e"
                                  : experience.difficulty_level === 2
                                  ? "#f59e0b"
                                  : experience.difficulty_level === 3
                                  ? "#ef4444"
                                  : theme.colors.textSecondary,
                              color: "white",
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.semibold,
                            }}
                          >
                            {experience.difficulty_level === 1
                              ? "Easy"
                              : experience.difficulty_level === 2
                              ? "Medium"
                              : experience.difficulty_level === 3
                              ? "Hard"
                              : "Unknown"}
                          </span>
                          <span
                            style={{
                              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                              borderRadius: theme.borderRadius.md,
                              backgroundColor:
                                experience.result === "selected"
                                  ? "#22c55e"
                                  : experience.result === "rejected"
                                  ? "#ef4444"
                                  : experience.result === "pending"
                                  ? "#f59e0b"
                                  : theme.colors.textSecondary,
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
                                fontWeight:
                                  theme.typography.fontWeight.semibold,
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
                                fontWeight:
                                  theme.typography.fontWeight.semibold,
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
                                fontWeight:
                                  theme.typography.fontWeight.semibold,
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
                      {/* Footer with delete */}
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
                          Posted on{" "}
                          {experience.created_at &&
                            new Date(experience.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                        </span>
                        <button
                          onClick={() => handleDeleteExperience(experience.id)}
                          style={{
                            backgroundColor: theme.colors.error,
                            color: theme.colors.textWhite,
                            border: "none",
                            borderRadius: theme.borderRadius.md,
                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.semibold,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message Display */}
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

        {/* Profile Form */}
        {activeTab === "profile" && (
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
                  fontSize: theme.typography.fontSize["2xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text,
                  margin: 0,
                }}
              >
                Edit Profile
              </h2>
            </div>

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
                />
              </div>

              {/* Branch and Year */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
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
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>Passout</option>
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
                />
              </div>

              {/* Social Links */}
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
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.textWhite,
                  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                  border: "none",
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.semibold,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: theme.transitions.normal,
                  opacity: loading ? 0.5 : 1,
                  justifySelf: "start",
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                {loading ? "⏳ Updating..." : "💾 Update Profile"}
              </button>
            </form>
          </div>
        )}

        {/* Posts Section */}
        {activeTab === "posts" && (
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.xl,
              boxShadow: theme.shadows.lg,
              border: `1px solid ${theme.colors.border}`,
              overflow: "hidden",
            }}
          >
            {/* Posts Header */}
            <div
              style={{
                padding: theme.spacing.xl,
                borderBottom: `1px solid ${theme.colors.border}`,
                background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.primaryHover}10 100%)`,
              }}
            >
              <h3
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.textPrimary,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                📝 My Posts
                <span
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.textWhite,
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  {userPosts.length}
                </span>
              </h3>
            </div>

            {/* Posts Content */}
            <div style={{ padding: theme.spacing.xl }}>
              {console.log(
                "Rendering posts section. postsLoading:",
                postsLoading,
                "userPosts.length:",
                userPosts.length,
                "userPosts:",
                userPosts
              )}
              {postsLoading ? (
                <div style={{ textAlign: "center", padding: theme.spacing.xl }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      border: `4px solid ${theme.colors.border}`,
                      borderTop: `4px solid ${theme.colors.primary}`,
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto",
                    }}
                  />
                  <p
                    style={{
                      marginTop: theme.spacing.md,
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.md,
                    }}
                  >
                    Loading your posts...
                  </p>
                </div>
              ) : userPosts.length === 0 ? (
                <div style={{ textAlign: "center", padding: theme.spacing.xl }}>
                  <div
                    style={{
                      fontSize: "4rem",
                      marginBottom: theme.spacing.md,
                    }}
                  >
                    📝
                  </div>
                  <h4
                    style={{
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.textPrimary,
                      margin: `0 0 ${theme.spacing.sm} 0`,
                    }}
                  >
                    No Posts Yet
                  </h4>
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.md,
                      margin: 0,
                    }}
                  >
                    You haven't created any posts yet. Start sharing your
                    knowledge!
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.lg,
                  }}
                >
                  {userPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      showVoting={false}
                      showDelete={true}
                      onDelete={handleDeletePost}
                      userProfile={userProfile}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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
