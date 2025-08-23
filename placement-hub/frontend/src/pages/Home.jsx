import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
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
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #1e40af",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect handled by App.jsx
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          color: "white",
          padding: "4rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              margin: "0 0 1rem 0",
            }}
          >
            Welcome to CET Placement Hub
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              marginBottom: "2rem",
              opacity: 0.9,
              margin: "0 0 2rem 0",
            }}
          >
            Your one-stop destination for placement preparation, resources, and
            success stories
          </p>
          <Link
            to="/login"
            style={{
              backgroundColor: "#fbbf24",
              color: "#1f2937",
              padding: "1rem 2rem",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textDecoration: "none",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            Get Started Today
          </Link>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.875rem",
              opacity: 0.8,
              margin: "1rem 0 0 0",
            }}
          >
            * Only @cet.ac.in email addresses are allowed
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: "4rem 0" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "3rem",
              color: "#1f2937",
              margin: "0 0 3rem 0",
            }}
          >
            Why Choose CET Placement Hub?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Feature 1 */}
            <div
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#dbeafe",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "2rem",
                }}
              >
                📚
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#1f2937",
                  margin: "0 0 1rem 0",
                }}
              >
                Subject-wise Resources
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Access curated study materials, practice questions, and notes
                for all subjects relevant to placement preparation.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#dbeafe",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "2rem",
                }}
              >
                🏢
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#1f2937",
                  margin: "0 0 1rem 0",
                }}
              >
                Company Insights
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Get detailed information about companies, their hiring
                processes, and interview experiences from seniors.
              </p>
            </div>

            {/* Feature 3 */}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "3rem 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              margin: "0 0 1rem 0",
            }}
          >
            Ready to boost your placement preparation?
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              marginBottom: "2rem",
              opacity: 0.9,
              margin: "0 0 2rem 0",
            }}
          >
            Join the platform to ace their placements.Learn from the tested
            resources and strategies used by our CET Friends to maximize your
            chances of success.
          </p>
          <Link
            to="/login"
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "1rem 2rem",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.2s",
              textDecoration: "none",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#3b82f6";
            }}
          >
            Get Started Now
          </Link>
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

export default Home;
