import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";

const SubjectBrowser = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchSubjects, setBranchSubjects] = useState([]);
  const [commonSubjects, setCommonSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userProfile?.branch) {
      setSelectedBranch(userProfile.branch);
    }
    fetchBranches();
    fetchCommonSubjects();
  }, [userProfile]);

  useEffect(() => {
    if (selectedBranch) {
      fetchBranchSubjects(selectedBranch);
    } else {
      setBranchSubjects([]);
    }
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const { data, error } = await apiService.getBranches();
      if (data) {
        // Handle both paginated and non-paginated responses
        const branchesData = data.results || data;
        if (Array.isArray(branchesData)) {
          setBranches(branchesData.map((branch) => branch.name));
        } else {
          throw new Error("Invalid branches data format");
        }
      } else if (error) {
        console.error("Error fetching branches:", error);
        // Fallback to hardcoded branches if API fails
        setBranches([
          "Computer Science Engineering",
          "Electronics and Communication Engineering",
          "Electrical and Electronics Engineering",
          "Mechanical Engineering",
          "Civil Engineering",
          "Architecture",
        ]);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      // Fallback to hardcoded branches if API fails
      setBranches([
        "Computer Science Engineering",
        "Electronics and Communication Engineering",
        "Electrical and Electronics Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Architecture",
      ]);
    }
  };

  const fetchCommonSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiService.getSubjects({ is_common: true });
      if (data) {
        // Handle both paginated and non-paginated responses
        const subjectsData = data.results || data;
        setCommonSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      }
    } catch (error) {
      setError("Failed to load common subjects");
      console.error("Error fetching common subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchSubjects = async (branchName) => {
    setLoading(true);
    try {
      const { data, error } = await apiService.getSubjects({
        branch: branchName,
      });
      if (data) {
        // Handle both paginated and non-paginated responses
        const subjectsData = data.results || data;
        setBranchSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      }
    } catch (error) {
      setError("Failed to load branch subjects");
      console.error("Error fetching branch subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const SubjectCard = ({ subject, isCommon = false }) => {
    const handleClick = () => {
      const encodedSubject = encodeURIComponent(subject.name || subject);
      navigate(`/subject/${encodedSubject}`);
    };

    return (
      <div
        onClick={handleClick}
        style={{
          backgroundColor: "#2a2a2a",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          border: "1px solid #404040",
          cursor: "pointer",
          transition: "all 0.2s",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#667eea";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 10px 25px rgba(102, 126, 234, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#404040";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {isCommon && (
          <div
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              backgroundColor: "#667eea",
              color: "white",
              fontSize: "0.75rem",
              padding: "0.25rem 0.5rem",
              borderRadius: "1rem",
              fontWeight: "500",
            }}
          >
            Common
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: isCommon ? "#667eea" : "#764ba2",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            {isCommon ? "📚" : getSubjectIcon(subject.name || subject)}
          </div>

          <h3
            style={{
              color: "#e0e0e0",
              fontSize: "1.1rem",
              fontWeight: "600",
              margin: 0,
              lineHeight: "1.3",
            }}
          >
            {subject.name || subject}
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <span
            style={{
              color: "#a0a0a0",
              fontSize: "0.85rem",
            }}
          >
            {isCommon ? "All Branches" : subject.branch_name || selectedBranch}
          </span>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                backgroundColor: "#333",
                color: "#a0a0a0",
                fontSize: "0.75rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem",
              }}
            >
              📝 Notes
            </span>
            <span
              style={{
                backgroundColor: "#333",
                color: "#a0a0a0",
                fontSize: "0.75rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem",
              }}
            >
              🎯 Practice
            </span>
          </div>
        </div>
      </div>
    );
  };

  const getSubjectIcon = (subject) => {
    const iconMap = {
      // CS/IT
      "Data Structures & Algorithms": "🔍",
      "Database Management Systems": "🗃️",
      "Operating Systems": "💻",
      "Computer Networks": "🌐",
      "Web Development": "🌍",
      "Machine Learning": "🤖",
      Cybersecurity: "🔒",

      // ECE/EEE
      "Digital Electronics": "⚡",
      "Signal Processing": "📡",
      "Communication Systems": "📻",
      "Circuit Analysis": "🔌",
      "Power Systems": "⚡",

      // Mechanical
      Thermodynamics: "🔥",
      "Fluid Mechanics": "💧",
      "Machine Design": "⚙️",
      "Manufacturing Processes": "🏭",

      // Civil
      "Structural Analysis": "🏗️",
      "Construction Management": "🏢",
      "Transportation Engineering": "🚗",

      // Chemical
      "Chemical Process Principles": "⚗️",
      "Process Control": "🎛️",

      // Biomedical
      Biomechanics: "🦴",
      "Medical Imaging": "🏥",
      "Tissue Engineering": "🧬",
    };

    return iconMap[subject] || "📖";
  };

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
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "1rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            📚 Subject Browser
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#a0a0a0",
              marginBottom: "2rem",
            }}
          >
            Explore subjects tailored to your branch and common placement topics
          </p>

          {/* Branch Selector */}
          <div
            style={{
              display: "inline-block",
              marginBottom: "1rem",
            }}
          >
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #404040",
                backgroundColor: "#2a2a2a",
                color: "#e0e0e0",
                fontSize: "1rem",
                minWidth: "300px",
                outline: "none",
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
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Common Subjects Section */}
        <div style={{ marginBottom: "4rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#667eea",
                margin: 0,
              }}
            >
              🎯 Common Placement Subjects
            </h2>
            <div
              style={{
                backgroundColor: "#667eea",
                color: "white",
                fontSize: "0.875rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontWeight: "500",
              }}
            >
              For All Branches
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {commonSubjects.map((subject, index) => (
              <SubjectCard key={index} subject={subject} isCommon={true} />
            ))}
          </div>
        </div>

        {/* Branch-Specific Subjects Section */}
        {selectedBranch && branchSubjects.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#764ba2",
                  margin: 0,
                }}
              >
                🎓 {selectedBranch} Subjects
              </h2>
              <div
                style={{
                  backgroundColor: "#764ba2",
                  color: "white",
                  fontSize: "0.875rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "1rem",
                  fontWeight: "500",
                }}
              >
                Branch Specific
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {branchSubjects.map((subject, index) => (
                <SubjectCard key={index} subject={subject} isCommon={false} />
              ))}
            </div>
          </div>
        )}

        {/* No branch selected message */}
        {!selectedBranch && (
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#2a2a2a",
              borderRadius: "1rem",
              padding: "3rem",
              border: "1px solid #404040",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                marginBottom: "1rem",
              }}
            >
              🎓
            </div>
            <h3
              style={{
                color: "#e0e0e0",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Select Your Branch
            </h3>
            <p
              style={{
                color: "#a0a0a0",
                fontSize: "1rem",
              }}
            >
              Choose your branch from the dropdown above to see branch-specific
              subjects along with common placement topics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectBrowser;
