import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import PostCard from "./PostCard";

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const [subject, setSubject] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortBy, setSortBy] = useState("votes"); // votes, recent, oldest

  // Form state
  const [formData, setFormData] = useState({
    topic: "",
    notes_link: "",
    video_link: "",
    focus_points: "",
    post_type: "question", // question, notes, tip, resource
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchSubjectData();
  }, [subjectId]);

  useEffect(() => {
    if (posts.length > 0) {
      sortPosts();
    }
  }, [sortBy]);

  const fetchSubjectData = async () => {
    setLoading(true);
    try {
      const subjectName = decodeURIComponent(subjectId);
      console.log("Looking for subject:", subjectName);
      console.log("User branch:", userProfile?.branch);

      // Try to fetch the subject from the database
      const subjectResponse = await apiService.getSubjectByName(
        subjectName,
        userProfile?.branch
      );

      console.log("Subject API response:", subjectResponse);
      console.log("Response data:", subjectResponse?.data);
      console.log("Response data type:", typeof subjectResponse?.data);
      console.log("Response results:", subjectResponse?.data?.results);
      console.log(
        "Response results length:",
        subjectResponse?.data?.results?.length
      );

      let selectedSubject = null;

      if (
        subjectResponse.data &&
        subjectResponse.data.results &&
        subjectResponse.data.results.length > 0
      ) {
        console.log("Found subjects:", subjectResponse.data.results);
        console.log("First subject:", subjectResponse.data.results[0]);
        // If multiple subjects found (common + branch-specific), prioritize branch-specific
        if (userProfile?.branch) {
          const branchSubject = subjectResponse.data.results.find(
            (s) => s.branch === userProfile.branch
          );
          const commonSubject = subjectResponse.data.results.find(
            (s) => s.is_common
          );
          selectedSubject =
            branchSubject || commonSubject || subjectResponse.data.results[0];
        } else {
          selectedSubject = subjectResponse.data.results[0];
        }
        console.log("Selected subject:", selectedSubject);
      } else {
        console.log("No subjects found in response");
        console.log("subjectResponse.data:", subjectResponse.data);
        console.log(
          "Array.isArray(subjectResponse.data):",
          Array.isArray(subjectResponse.data)
        );
      }

      if (!selectedSubject) {
        // Create a temporary subject object if not found in DB
        selectedSubject = {
          id: `temp_${Date.now()}`,
          name: subjectName,
          description: `Study materials and discussions for ${subjectName}`,
          branch: userProfile?.branch || "Common",
          is_common: false,
        };
      }

      setSubject(selectedSubject);

      // Fetch posts for this subject (if it exists in DB)
      if (
        selectedSubject.id &&
        !selectedSubject.id.toString().startsWith("temp_")
      ) {
        try {
          const postsResponse = await apiService.getPosts({
            subject: selectedSubject.id,
          });
          if (postsResponse.data && postsResponse.data.results) {
            setPosts(postsResponse.data.results);
          }
        } catch (error) {
          console.log("No posts found for this subject:", error);
          setPosts([]);
        }
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching subject data:", error);
      // For demo purposes, we'll still show the subject even if posts fail
      const mockSubject = {
        id: `temp_${Date.now()}`,
        name: decodeURIComponent(subjectId),
        description: `Study materials and discussions for ${decodeURIComponent(
          subjectId
        )}`,
        branch: userProfile?.branch || "Common",
      };
      setSubject(mockSubject);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortPosts = () => {
    const sortedPosts = [...posts].sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        case "recent":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return 0;
      }
    });
    setPosts(sortedPosts);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userProfile) {
      setError("Please complete your profile first");
      return;
    }

    console.log("=== POST CREATION DEBUG ===");
    console.log("Current subject:", subject);
    console.log("User profile:", userProfile);
    console.log("Form data:", formData);

    if (!subject || subject.id.toString().startsWith("temp_")) {
      setError(
        "Subject not found in database. Cannot create posts for temporary subjects."
      );
      console.log("ERROR: Subject is temporary or not found");
      return;
    }

    setSubmitLoading(true);
    try {
      const postData = {
        ...formData,
        subject: subject.id, // Use the actual subject ID from database
        posted_by: userProfile.id,
      };

      console.log("Creating post with data:", postData);
      const response = await apiService.createPost(postData);
      console.log("Post creation response:", response);

      if (response.data) {
        console.log("Post created successfully!");
        setPosts((prev) => [response.data, ...prev]);
        setFormData({
          topic: "",
          notes_link: "",
          video_link: "",
          focus_points: "",
          post_type: "question",
        });
        setShowCreateForm(false);
        setError(""); // Clear any previous errors
      } else if (response.error) {
        console.error("Post creation error:", response.error);
        setError(
          `Failed to create post: ${
            response.error.response?.data?.detail ||
            response.error.message ||
            "Unknown error"
          }`
        );
      }
    } catch (error) {
      setError("Failed to create post. Please try again.");
      console.error("Error creating post:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      if (!userProfile) {
        alert("Please log in to like posts");
        return;
      }

      // Find the current post to check existing vote
      const currentPost = posts.find((p) => p.id === postId);
      const currentUserVote = currentPost?.user_vote;

      let vote;

      // Only handle upvotes (likes) - remove downvote functionality
      if (voteType === "upvote") {
        if (currentUserVote === 1) {
          // User already liked, remove the like
          vote = 0;
        } else {
          // User hasn't liked, set to like
          vote = 1;
        }
      } else {
        // No downvote functionality - just return
        return;
      }

      console.log(
        `${
          currentUserVote === 1 ? "Unliking" : "Liking"
        } post ${postId}. Current vote: ${currentUserVote}`
      );

      const response = await apiService.voteOnPost(postId, vote);

      if (response.error) {
        console.error("Vote error:", response.error);

        // Handle authentication error specifically
        if (response.error.response?.status === 401) {
          alert("Your session has expired. Please log in again to like posts.");
          return;
        }

        alert("Error liking post. Please try again.");
        return;
      }

      if (response.data) {
        console.log("Like response:", response.data);
        // Update the post with the response data from server
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
                user_vote: response.data.user_vote,
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Error liking post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid rgba(255,255,255,0.3)",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <p>Loading subject...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "1rem",
            padding: "2rem",
            marginBottom: "2rem",
            border: "1px solid #333",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div>
              <button
                onClick={() => navigate(-1)}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #404040",
                  color: "#a0a0a0",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                ← Back
              </button>

              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "white",
                  margin: "0 0 0.5rem 0",
                }}
              >
                {subject?.name}
              </h1>

              <p
                style={{
                  color: "#a0a0a0",
                  fontSize: "1.1rem",
                  margin: "0 0 1rem 0",
                }}
              >
                {subject?.description}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#667eea",
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "1rem",
                    fontSize: "0.875rem",
                  }}
                >
                  {subject?.branch}
                </span>
                <span style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>
                  {posts.length} posts
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              + New Post
            </button>
          </div>
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <div
            style={{
              backgroundColor: "#1e1e1e",
              borderRadius: "1rem",
              padding: "2rem",
              marginBottom: "2rem",
              border: "1px solid #333",
            }}
          >
            <h3
              style={{
                color: "white",
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Create New Post
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {/* Post Type */}
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#e0e0e0",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Post Type
                  </label>
                  <select
                    name="post_type"
                    value={formData.post_type}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "#2a2a2a",
                      border: "1px solid #404040",
                      borderRadius: "0.5rem",
                      color: "#e0e0e0",
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="question">❓ Question</option>
                    <option value="notes">📝 Notes/Study Material</option>
                    <option value="tip">💡 Tip/Advice</option>
                    <option value="resource">🔗 Resource/Link</option>
                  </select>
                </div>

                {/* Topic */}
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#e0e0e0",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter a descriptive title..."
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "#2a2a2a",
                      border: "1px solid #404040",
                      borderRadius: "0.5rem",
                      color: "#e0e0e0",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                {/* Links Row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#e0e0e0",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Notes/Document Link
                    </label>
                    <input
                      type="url"
                      name="notes_link"
                      value={formData.notes_link}
                      onChange={handleInputChange}
                      placeholder="https://drive.google.com/..."
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #404040",
                        borderRadius: "0.5rem",
                        color: "#e0e0e0",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        color: "#e0e0e0",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Video Link
                    </label>
                    <input
                      type="url"
                      name="video_link"
                      value={formData.video_link}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/..."
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #404040",
                        borderRadius: "0.5rem",
                        color: "#e0e0e0",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>
                </div>

                {/* Focus Points */}
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#e0e0e0",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Key Points/Tags
                  </label>
                  <input
                    type="text"
                    name="focus_points"
                    value={formData.focus_points}
                    onChange={handleInputChange}
                    placeholder="Important topics, tags, or key points (comma separated)"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "#2a2a2a",
                      border: "1px solid #404040",
                      borderRadius: "0.5rem",
                      color: "#e0e0e0",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              {error && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {error}
                </div>
              )}

              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #404040",
                    color: "#e0e0e0",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    color: "white",
                    borderRadius: "0.5rem",
                    cursor: submitLoading ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    opacity: submitLoading ? 0.7 : 1,
                  }}
                >
                  {submitLoading ? "Posting..." : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sort Controls */}
        <div
          style={{
            backgroundColor: "#1e1e1e",
            borderRadius: "1rem",
            padding: "1rem 2rem",
            marginBottom: "1rem",
            border: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              color: "white",
              margin: 0,
              fontSize: "1.2rem",
            }}
          >
            Posts & Discussions
          </h3>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["votes", "recent", "oldest"].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: sortBy === option ? "#667eea" : "#2a2a2a",
                  border: "1px solid #404040",
                  color: sortBy === option ? "white" : "#a0a0a0",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  textTransform: "capitalize",
                }}
              >
                {option === "votes"
                  ? "🔥 Top Voted"
                  : option === "recent"
                  ? "🕒 Recent"
                  : "📅 Oldest"}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div style={{ display: "grid", gap: "1rem" }}>
          {posts.length === 0 ? (
            <div
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "1rem",
                padding: "3rem",
                border: "1px solid #333",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📝</div>
              <h3 style={{ color: "#e0e0e0", marginBottom: "1rem" }}>
                No posts yet
              </h3>
              <p style={{ color: "#a0a0a0", marginBottom: "2rem" }}>
                Be the first to share questions, notes, or tips for this
                subject!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  color: "white",
                  padding: "0.75rem 2rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Create First Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showVoting={true}
                onVote={handleVote}
                userProfile={userProfile}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
