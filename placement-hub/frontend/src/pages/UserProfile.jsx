import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../styles/theme";
import apiService from "../services/api";
import PostCard from "../components/PostCard";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userProfile: currentUserProfile } = useAuth();
  const [targetUserProfile, setTargetUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to get year display
  const getYearDisplay = (year) => {
    const yearMap = {
      1: "1st Year",
      2: "2nd Year",
      3: "3rd Year",
      4: "4th Year",
      5: "Passout",
    };
    return yearMap[year] || `Year ${year}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // If it's the current user, redirect to profile page
        if (
          currentUserProfile &&
          (currentUserProfile.id.toString() === userId ||
            currentUserProfile.supabase_uid === userId)
        ) {
          navigate("/profile");
          return;
        }

        // Fetch target user profile
        const userResponse = await apiService.getUserProfile(userId);
        if (userResponse.error) {
          setError("User not found");
          return;
        }
        setTargetUserProfile(userResponse.data);

        // Fetch user posts
        const postsResponse = await apiService.getPosts({ user: userId });
        if (postsResponse.error) {
          console.error("Error fetching user posts:", postsResponse.error);
          setUserPosts([]);
        } else {
          setUserPosts(postsResponse.data.results || postsResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, currentUserProfile, navigate]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.colors.background,
          padding: theme.spacing.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: `3px solid ${theme.colors.border}`,
              borderTop: `3px solid ${theme.colors.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <p style={{ color: theme.colors.text }}>Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.colors.background,
          padding: theme.spacing.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.lg,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: theme.spacing.md }}>
            😞
          </div>
          <h2
            style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
            }}
          >
            {error}
          </h2>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.surface,
              border: "none",
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: "pointer",
              transition: theme.transitions.normal,
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!targetUserProfile) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* User Profile Header */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.lg,
            marginBottom: theme.spacing.lg,
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
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: theme.colors.primary,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.surface,
              }}
            >
              {targetUserProfile.full_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h1
                style={{
                  fontSize: theme.typography.fontSize["2xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text,
                  margin: 0,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {targetUserProfile.full_name}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.md,
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.base,
                }}
              >
                <span>📚 {targetUserProfile.branch}</span>
                <span>•</span>
                <span>🎓 {getYearDisplay(targetUserProfile.year)}</span>
                <span>•</span>
                <span>⭐ {targetUserProfile.points || 0} points</span>
              </div>
            </div>
          </div>

          {targetUserProfile.bio && (
            <div
              style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.md,
              }}
            >
              <h3
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm,
                }}
              >
                📝 About
              </h3>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.base,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  margin: 0,
                }}
              >
                {targetUserProfile.bio}
              </p>
            </div>
          )}

          {targetUserProfile.skills && (
            <div
              style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <h3
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm,
                }}
              >
                💻 Skills
              </h3>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.base,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  margin: 0,
                }}
              >
                {targetUserProfile.skills}
              </p>
            </div>
          )}
        </div>

        {/* User Posts Section */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.lg,
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
            📝 Posts by {targetUserProfile.full_name} ({userPosts.length})
          </h2>

          {userPosts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: theme.spacing.xl,
                color: theme.colors.textSecondary,
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: theme.spacing.md }}>
                📝
              </div>
              <h3
                style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  marginBottom: theme.spacing.sm,
                }}
              >
                No posts yet
              </h3>
              <p style={{ fontSize: theme.typography.fontSize.base }}>
                {targetUserProfile.full_name} hasn't shared any posts yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: theme.spacing.md,
              }}
            >
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  showVoting={false}
                  userProfile={currentUserProfile}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
