import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { theme } from "./styles/theme";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import ProfileSetup from "./components/ProfileSetup";
import SubjectBrowser from "./components/SubjectBrowser";
import SubjectDetail from "./components/SubjectDetail";
import Companies from "./pages/Companies";
import CompanyPage from "./pages/CompanyPage";
import "./App.css";

// Admin Redirect component
const AdminRedirect = () => {
  React.useEffect(() => {
    // Get the API base URL from environment or use default
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    // Remove /api from the end to get the admin URL
    const baseUrl = apiBaseUrl.replace(/\/api$/, '');
    const adminUrl = `${baseUrl}/admin/login/?next=/admin/`;
    
    console.log("Redirecting to admin:", adminUrl);
    window.location.href = adminUrl;
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e1e1e",
        color: "#e0e0e0",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚙️</div>
        <h2>Redirecting to Admin Panel...</h2>
        <p>You will be redirected to the Django admin interface.</p>
      </div>
    </div>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surface,
          fontFamily: theme.typography.fontFamily.primary,
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
          <p style={{ color: theme.colors.text }}>Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surface,
          fontFamily: theme.typography.fontFamily.primary,
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
          <p style={{ color: theme.colors.text }}>Loading...</p>
        </div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: theme.colors.surface,
            fontFamily: theme.typography.fontFamily.primary,
            color: theme.colors.text,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/:userId"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile-setup"
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subject-browser"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <SubjectBrowser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects"
                element={<Navigate to="/subject-browser" replace />}
              />
              <Route
                path="/companies"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <Companies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/:id"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <CompanyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subject/:subjectId"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <SubjectDetail />
                  </ProtectedRoute>
                }
              />

              {/* Admin redirect */}
              <Route path="/admin" element={<AdminRedirect />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
