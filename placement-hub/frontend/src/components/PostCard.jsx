import React from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

const PostCard = ({
  post,
  showVoting = false,
  onVote = null,
  userProfile = null,
  showDelete = false,
  onDelete = null,
}) => {
  const navigate = useNavigate();

  const getPostTypeColor = (type) => {
    switch (type) {
      case "notes":
        return "#3b82f6";
      case "video":
        return "#ef4444";
      case "question":
        return "#f59e0b";
      default:
        return "#10b981";
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case "notes":
        return "📄";
      case "video":
        return "🎥";
      case "question":
        return "❓";
      default:
        return "📝";
    }
  };

  const handleCardClick = () => {
    if (post.subject?.id) {
      navigate(`/subject/${post.subject.id}`);
    } else if (post.subject_id) {
      navigate(`/subject/${post.subject_id}`);
    } else if (post.subject?.name) {
      navigate(`/subject/${encodeURIComponent(post.subject.name)}`);
    } else if (post.subject_name) {
      navigate(`/subject/${encodeURIComponent(post.subject_name)}`);
    }
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation(); // Prevent card navigation when clicking author name
    e.preventDefault(); // Prevent any default behavior
    if (post.posted_by_uid) {
      navigate(`/user/${post.posted_by_uid}`);
    } else if (post.posted_by) {
      // Fallback to database ID if Supabase UID is not available
      navigate(`/user/${post.posted_by}`);
    }
  };

  const handleVoteClick = (e) => {
    e.stopPropagation(); // Prevent card navigation when voting
    if (onVote) {
      onVote(post.id, "upvote");
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        border: `1px solid ${theme.colors.border}`,
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = theme.shadows.lg;
        e.currentTarget.style.borderColor = theme.colors.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = theme.shadows.md;
        e.currentTarget.style.borderColor = theme.colors.border;
      }}
      onClick={handleCardClick}
    >
      <div
        style={{
          display: "flex",
          gap: theme.spacing.lg,
        }}
      >
        {/* Voting Section - Only show if enabled */}
        {showVoting && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
              minWidth: "80px",
            }}
          >
            <button
              onClick={handleVoteClick}
              style={{
                backgroundColor:
                  post.user_vote === 1 ? theme.colors.success : "transparent",
                border: "1px solid",
                borderColor:
                  post.user_vote === 1
                    ? theme.colors.success
                    : theme.colors.border,
                color:
                  post.user_vote === 1
                    ? theme.colors.textWhite
                    : theme.colors.success,
                borderRadius: theme.borderRadius.md,
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                cursor: "pointer",
                fontSize: theme.typography.fontSize.sm,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.xs,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (post.user_vote !== 1) {
                  e.target.style.backgroundColor = theme.colors.success;
                  e.target.style.color = theme.colors.textWhite;
                }
              }}
              onMouseLeave={(e) => {
                if (post.user_vote !== 1) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = theme.colors.success;
                }
              }}
            >
              {post.user_vote === 1 ? "❤️" : "🤍"} {post.upvotes || 0}
            </button>
          </div>
        )}

        {/* Content Section */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.md,
              marginBottom: theme.spacing.md,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                backgroundColor: getPostTypeColor(post.post_type),
                color: theme.colors.textWhite,
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.full,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              {getPostTypeIcon(post.post_type)} {post.post_type || "question"}
            </span>

            {(post.subject?.name || post.subject_name) && (
              <span
                style={{
                  backgroundColor: `${theme.colors.primary}20`,
                  color: theme.colors.primary,
                  padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.medium,
                  border: `1px solid ${theme.colors.primary}40`,
                }}
              >
                📚 {post.subject?.name || post.subject_name}
              </span>
            )}

            <span
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                marginLeft: "auto",
              }}
            >
              by{" "}
              <span
                onClick={handleAuthorClick}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                style={{
                  color: theme.colors.primary,
                  cursor: "pointer",
                  textDecoration: "none",
                  fontWeight: theme.typography.fontWeight.medium,
                  transition: theme.transitions.normal,
                  userSelect: "none",
                }}
                onMouseOver={(e) => {
                  e.target.style.textDecoration = "underline";
                }}
                onMouseOut={(e) => {
                  e.target.style.textDecoration = "none";
                }}
              >
                {post.posted_by_name || "Anonymous"}
              </span>{" "}
              • {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Title */}
          <h4
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              margin: `0 0 ${theme.spacing.md} 0`,
              lineHeight: theme.typography.lineHeight.tight,
            }}
          >
            {post.topic || post.title || "Untitled Post"}
          </h4>

          {/* Content Preview */}
          {post.content && (
            <p
              style={{
                color: theme.colors.textSecondary,
                lineHeight: theme.typography.lineHeight.relaxed,
                margin: `0 0 ${theme.spacing.md} 0`,
                fontSize: theme.typography.fontSize.md,
              }}
            >
              {post.content.length > 200
                ? `${post.content.substring(0, 200)}...`
                : post.content}
            </p>
          )}

          {/* Focus Points */}
          {post.focus_points && (
            <div
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                marginBottom: theme.spacing.md,
              }}
            >
              <p
                style={{
                  color: theme.colors.textSecondary,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  margin: 0,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                <strong style={{ color: theme.colors.success }}>
                  Focus Points:
                </strong>
                <br />
                {post.focus_points.length > 150
                  ? `${post.focus_points.substring(0, 150)}...`
                  : post.focus_points}
              </p>
            </div>
          )}

          {/* Links */}
          {(post.notes_link || post.video_link) && (
            <div
              style={{
                display: "flex",
                gap: theme.spacing.md,
                marginBottom: theme.spacing.md,
              }}
            >
              {post.notes_link && (
                <a
                  href={post.notes_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    color: theme.colors.info,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSize.sm,
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                  }}
                >
                  📄 Notes/Documents
                </a>
              )}

              {post.video_link && (
                <a
                  href={post.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    color: theme.colors.error,
                    textDecoration: "none",
                    fontSize: theme.typography.fontSize.sm,
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                  }}
                >
                  🎥 Video
                </a>
              )}
            </div>
          )}

          {/* Footer with metadata */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              borderTop: `1px solid ${theme.colors.border}`,
              paddingTop: theme.spacing.md,
              marginTop: theme.spacing.md,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.md,
              }}
            >
              {post.difficulty_level && <span>📈 {post.difficulty_level}</span>}
              {post.time_to_complete && (
                <>
                  <span>•</span>
                  <span>⏱️ {post.time_to_complete} mins</span>
                </>
              )}
            </div>

            {!showVoting && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.xs,
                }}
              >
                <span>❤️ {post.upvotes || 0}</span>
              </div>
            )}

            {/* Delete Button */}
            {showDelete && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card navigation when deleting
                  onDelete(post.id);
                }}
                style={{
                  backgroundColor: theme.colors.error,
                  color: theme.colors.textWhite,
                  border: "none",
                  borderRadius: theme.borderRadius.md,
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.colors.error;
                }}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
