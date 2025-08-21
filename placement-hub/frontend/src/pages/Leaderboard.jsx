import React, { useState, useEffect } from "react";
import apiService from "../services/api";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, branch, year

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiService.getLeaderboard();
      if (data) {
        setLeaderboard(data);
      } else {
        console.error("Error fetching leaderboard:", error);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
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
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🏅";
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "#fbbf24"; // Gold
      case 2:
        return "#a3a3a3"; // Silver
      case 3:
        return "#cd7c32"; // Bronze
      default:
        return "#6b7280"; // Gray
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div
        style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#1f2937",
              margin: "0 0 1rem 0",
            }}
          >
            🏆 Leaderboard
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#6b7280",
              margin: 0,
            }}
          >
            See how you rank among your peers based on contributions and
            engagement
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.5rem",
              backgroundColor: filter === "all" ? "#1e40af" : "#f3f4f6",
              color: filter === "all" ? "white" : "#374151",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            All Students
          </button>
          <button
            onClick={() => setFilter("branch")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.5rem",
              backgroundColor: filter === "branch" ? "#1e40af" : "#f3f4f6",
              color: filter === "branch" ? "white" : "#374151",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            By Branch
          </button>
          <button
            onClick={() => setFilter("year")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "0.5rem",
              backgroundColor: filter === "year" ? "#1e40af" : "#f3f4f6",
              color: filter === "year" ? "white" : "#374151",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            By Year
          </button>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div
            style={{
              marginBottom: "3rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "end",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {/* 2nd Place */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "1.5rem",
                textAlign: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                minWidth: "200px",
                height: "250px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                  🥈
                </div>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#374151",
                  }}
                >
                  {leaderboard[1]?.full_name?.[0]?.toUpperCase() || "U"}
                </div>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    margin: "0 0 0.25rem 0",
                    color: "#1f2937",
                  }}
                >
                  {leaderboard[1]?.full_name}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    margin: "0 0 1rem 0",
                  }}
                >
                  {leaderboard[1]?.branch}
                </p>
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#a3a3a3",
                }}
              >
                {leaderboard[1]?.points} pts
              </div>
            </div>

            {/* 1st Place */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "2rem",
                textAlign: "center",
                boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
                minWidth: "220px",
                height: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "3px solid #fbbf24",
              }}
            >
              <div>
                <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>
                  👑
                </div>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#fef3c7",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#92400e",
                    border: "3px solid #fbbf24",
                  }}
                >
                  {leaderboard[0]?.full_name?.[0]?.toUpperCase() || "U"}
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    margin: "0 0 0.25rem 0",
                    color: "#1f2937",
                  }}
                >
                  {leaderboard[0]?.full_name}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    margin: "0 0 1rem 0",
                  }}
                >
                  {leaderboard[0]?.branch}
                </p>
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#fbbf24",
                }}
              >
                {leaderboard[0]?.points} pts
              </div>
            </div>

            {/* 3rd Place */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "1.5rem",
                textAlign: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                minWidth: "200px",
                height: "250px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                  🥉
                </div>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#374151",
                  }}
                >
                  {leaderboard[2]?.full_name?.[0]?.toUpperCase() || "U"}
                </div>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    margin: "0 0 0.25rem 0",
                    color: "#1f2937",
                  }}
                >
                  {leaderboard[2]?.full_name}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    margin: "0 0 1rem 0",
                  }}
                >
                  {leaderboard[2]?.branch}
                </p>
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#cd7c32",
                }}
              >
                {leaderboard[2]?.points} pts
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: 0,
                color: "#1f2937",
              }}
            >
              Complete Rankings
            </h2>
          </div>

          {leaderboard.length > 0 ? (
            <div>
              {leaderboard.map((student, index) => (
                <div
                  key={student.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1rem 1.5rem",
                    borderBottom:
                      index < leaderboard.length - 1
                        ? "1px solid #e5e7eb"
                        : "none",
                    backgroundColor: index < 3 ? "#fef9e7" : "white",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (index >= 3) e.target.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    if (index >= 3) e.target.style.backgroundColor = "white";
                  }}
                >
                  {/* Rank */}
                  <div
                    style={{
                      width: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.5rem",
                        marginRight: "0.5rem",
                      }}
                    >
                      {getRankIcon(index + 1)}
                    </span>
                    <span
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: getRankColor(index + 1),
                      }}
                    >
                      #{index + 1}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 1rem",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      color: "#374151",
                    }}
                  >
                    {student.full_name?.[0]?.toUpperCase() || "U"}
                  </div>

                  {/* Student Info */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "bold",
                        margin: "0 0 0.25rem 0",
                        color: "#1f2937",
                      }}
                    >
                      {student.full_name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        margin: 0,
                      }}
                    >
                      {student.branch} • Year {student.year}
                    </p>
                  </div>

                  {/* Points */}
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#1e40af",
                        margin: "0 0 0.25rem 0",
                      }}
                    >
                      {student.points}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  margin: "0 0 0.5rem 0",
                  color: "#1f2937",
                }}
              >
                No rankings yet
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                Start contributing to the community to see your name on the
                leaderboard!
              </p>
            </div>
          )}
        </div>

        {/* How Points Work */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            padding: "2rem",
            marginTop: "2rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#1f2937",
              margin: "0 0 1rem 0",
            }}
          >
            How do I earn points? 🤔
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f0f9ff",
                borderRadius: "0.5rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                📝
              </div>
              <div style={{ fontWeight: "bold", color: "#1e40af" }}>
                +10 points
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Creating a post
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f0fdf4",
                borderRadius: "0.5rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                🎯
              </div>
              <div style={{ fontWeight: "bold", color: "#059669" }}>
                +15 points
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Sharing interview experience
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fef3c7",
                borderRadius: "0.5rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                👍
              </div>
              <div style={{ fontWeight: "bold", color: "#d97706" }}>
                +5 points
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Getting likes on posts
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fdf2f8",
                borderRadius: "0.5rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                💬
              </div>
              <div style={{ fontWeight: "bold", color: "#be185d" }}>
                +3 points
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Helpful comments
              </div>
            </div>
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

export default Leaderboard;
