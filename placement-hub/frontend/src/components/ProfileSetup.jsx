import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

const ProfileSetup = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    branch: "",
    year: 1,
    placement_status: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || "",
        branch: userProfile.branch || "",
        year: userProfile.year || 1,
        placement_status: userProfile.placement_status || "",
      });
      // If profile is complete, don't show as editing by default
      setIsEditing(!userProfile.branch); // Edit mode if branch is empty
    }
  }, [userProfile]);

  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      const { data, error } = await apiService.getBranches();
      if (data && data.results) {
        setBranches(data.results);
      } else if (error) {
        console.error("Error fetching branches:", error);
        // Fallback to hardcoded branches if API fails
        setBranches([
          { id: 1, name: "Computer Science Engineering" },
          { id: 2, name: "Electronics and Communication Engineering" },
          { id: 3, name: "Electrical and Electronics Engineering" },
          { id: 4, name: "Mechanical Engineering" },
          { id: 5, name: "Civil Engineering" },
          { id: 6, name: "Architecture" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      // Fallback to hardcoded branches if API fails
      setBranches([
        { id: 1, name: "Computer Science Engineering" },
        { id: 2, name: "Electronics and Communication Engineering" },
        { id: 3, name: "Electrical and Electronics Engineering" },
        { id: 4, name: "Mechanical Engineering" },
        { id: 5, name: "Civil Engineering" },
        { id: 6, name: "Architecture" },
      ]);
    } finally {
      setBranchesLoading(false);
    }
  };

  const placementStatuses = [
    "Seeking Placement",
    "Placed",
    "Higher Studies",
    "Entrepreneur",
    "Not Looking",
  ];

  // Helper function to display year
  const getYearDisplay = (year) => {
    switch (year) {
      case 1:
        return "1st Year";
      case 2:
        return "2nd Year";
      case 3:
        return "3rd Year";
      case 4:
        return "4th Year";
      case 5:
        return "Passout";
      default:
        return `Year ${year}`;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateProfile(formData);
      setMessage("Profile updated successfully!");
      setIsEditing(false);

      // If this was initial setup, redirect to dashboard
      if (!userProfile?.branch) {
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isProfileComplete = userProfile?.branch && userProfile?.full_name;

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
      <div
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "1.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid #333",
          padding: "0",
          width: "100%",
          maxWidth: "700px",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "3rem 2rem",
            textAlign: "center",
            color: "white",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              margin: "0 auto 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              fontWeight: "bold",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {userProfile?.full_name
              ? userProfile.full_name.charAt(0).toUpperCase()
              : "👤"}
          </div>

          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {userProfile?.full_name || "Welcome!"}
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.9,
              marginBottom: "0.5rem",
            }}
          >
            {userProfile?.email || user?.email}
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              padding: "0.5rem 1rem",
              borderRadius: "2rem",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
            }}
          >
            🏆 {userProfile?.points || 0} Points
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: "2rem" }}>
          {/* Profile Info Display */}
          {!isEditing && isProfileComplete && (
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {/* Academic Info Card */}
                <div
                  style={{
                    backgroundColor: "#2a2a2a",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    border: "1px solid #404040",
                  }}
                >
                  <h3
                    style={{
                      color: "#667eea",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    🎓 Academic Information
                  </h3>

                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>
                        Branch
                      </span>
                      <span style={{ color: "#e0e0e0", fontWeight: "500" }}>
                        {userProfile.branch}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>
                        Year
                      </span>
                      <span
                        style={{
                          color: "#e0e0e0",
                          fontWeight: "500",
                          backgroundColor: "#667eea",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "1rem",
                          fontSize: "0.8rem",
                        }}
                      >
                        {getYearDisplay(userProfile.year)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div
                  style={{
                    backgroundColor: "#2a2a2a",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    border: "1px solid #404040",
                  }}
                >
                  <h3
                    style={{
                      color: "#667eea",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    📊 Status
                  </h3>

                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>
                        Placement Status
                      </span>
                      <span
                        style={{
                          color: userProfile.placement_status
                            ? "#10b981"
                            : "#a0a0a0",
                          fontWeight: "500",
                          fontSize: "0.9rem",
                        }}
                      >
                        {userProfile.placement_status || "Not Set"}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>
                        Member Since
                      </span>
                      <span
                        style={{
                          color: "#e0e0e0",
                          fontWeight: "500",
                          fontSize: "0.9rem",
                        }}
                      >
                        {userProfile.created_at
                          ? new Date(
                              userProfile.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {/* Full Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#e0e0e0",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #404040",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                      backgroundColor: "#2a2a2a",
                      color: "#e0e0e0",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#404040")}
                  />
                </div>

                {/* Branch */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#e0e0e0",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Branch *
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    required
                    disabled={branchesLoading}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #404040",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      outline: "none",
                      backgroundColor: "#2a2a2a",
                      color: "#e0e0e0",
                    }}
                  >
                    <option value="">
                      {branchesLoading
                        ? "Loading branches..."
                        : "Select your branch"}
                    </option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#e0e0e0",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #404040",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      outline: "none",
                      backgroundColor: "#2a2a2a",
                      color: "#e0e0e0",
                    }}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>Passout</option>
                  </select>
                </div>

                {/* Placement Status */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#e0e0e0",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Placement Status
                  </label>
                  <select
                    name="placement_status"
                    value={formData.placement_status}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #404040",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      outline: "none",
                      backgroundColor: "#2a2a2a",
                      color: "#e0e0e0",
                    }}
                  >
                    <option value="">Select status (optional)</option>
                    {placementStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    backgroundColor: message.includes("Error")
                      ? "#fee2e2"
                      : "#d1fae5",
                    color: message.includes("Error") ? "#dc2626" : "#065f46",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  {message}
                </div>
              )}

              {/* Buttons */}
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                {isProfileComplete && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      border: "1px solid #404040",
                      borderRadius: "0.5rem",
                      backgroundColor: "#2a2a2a",
                      color: "#e0e0e0",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading
                    ? "Saving..."
                    : !isProfileComplete
                    ? "Complete Setup"
                    : "Update Profile"}
                </button>
              </div>
            </form>
          )}

          {/* Edit Button */}
          {!isEditing && isProfileComplete && (
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: "0.75rem 2rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginRight: "1rem",
                }}
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  padding: "0.75rem 2rem",
                  border: "1px solid #404040",
                  borderRadius: "0.5rem",
                  backgroundColor: "#2a2a2a",
                  color: "#e0e0e0",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
