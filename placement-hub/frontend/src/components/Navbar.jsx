import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../styles/theme";

const Navbar = () => {
  const { user, userProfile, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: "/dashboard", label: "📊 Dashboard", icon: "📊" },
    { to: "/subject-browser", label: "📚 Subjects", icon: "📚" },
    { to: "/companies", label: "🏢 Companies", icon: "🏢" },
    { to: "/profile", label: "👤 Profile", icon: "👤" },
  ];

  const NavLink = ({ to, children, onClick, isMobile = false }) => (
    <Link
      to={to}
      onClick={onClick}
      style={{
        textDecoration: "none",
        color: isActive(to) ? theme.colors.primary : theme.colors.text,
        fontWeight: isActive(to)
          ? theme.typography.fontWeight.semibold
          : theme.typography.fontWeight.medium,
        padding: isMobile
          ? `${theme.spacing.md}`
          : `${theme.spacing.sm} ${theme.spacing.md}`,
        borderRadius: theme.borderRadius.md,
        transition: theme.transitions.normal,
        backgroundColor: isActive(to)
          ? theme.colors.primaryLight
          : "transparent",
        border: `2px solid ${
          isActive(to) ? theme.colors.primary : "transparent"
        }`,
        display: isMobile ? "block" : "inline-block",
        width: isMobile ? "100%" : "auto",
        marginBottom: isMobile ? theme.spacing.sm : "0",
        fontSize: isMobile
          ? theme.typography.fontSize.lg
          : theme.typography.fontSize.base,
      }}
      onMouseEnter={(e) => {
        if (!isActive(to)) {
          e.target.style.backgroundColor = theme.colors.surface;
          e.target.style.color = theme.colors.primary;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive(to)) {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = theme.colors.text;
        }
      }}
    >
      {children}
    </Link>
  );

  return (
    <nav
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        padding: `${theme.spacing.md} 0`,
        boxShadow: theme.shadows.md,
        borderBottom: `1px solid ${theme.colors.border}`,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: `0 ${theme.spacing.md}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/"}
          style={{
            fontSize:
              window.innerWidth < 768
                ? theme.typography.fontSize.xl
                : theme.typography.fontSize["2xl"],
            fontWeight: theme.typography.fontWeight.bold,
            textDecoration: "none",
            color: theme.colors.primary,
            transition: theme.transitions.normal,
          }}
          onMouseEnter={(e) =>
            (e.target.style.color = theme.colors.primaryHover)
          }
          onMouseLeave={(e) => (e.target.style.color = theme.colors.primary)}
        >
          🎓 CET Hub
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <>
            <div
              style={{
                display: window.innerWidth >= 768 ? "flex" : "none",
                alignItems: "center",
                gap: theme.spacing.lg,
              }}
            >
              <div style={{ display: "flex", gap: theme.spacing.md }}>
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to}>
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* User Info & Sign Out */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.md,
                  marginLeft: theme.spacing.lg,
                  paddingLeft: theme.spacing.lg,
                  borderLeft: `2px solid ${theme.colors.border}`,
                }}
              >
                {userProfile && (
                  <div
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.sm,
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{ fontWeight: theme.typography.fontWeight.medium }}
                    >
                      {userProfile.full_name}
                    </div>
                    <div style={{ fontSize: theme.typography.fontSize.xs }}>
                      {userProfile.branch} • {userProfile.year}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  style={{
                    ...(theme.commonStyles?.button?.outline || {
                      backgroundColor: "transparent",
                      color: theme.colors.primary,
                      border: `2px solid ${theme.colors.primary}`,
                      borderRadius: theme.borderRadius.md,
                      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      cursor: "pointer",
                      transition: theme.transitions.normal,
                    }),
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.primary;
                    e.target.style.color = theme.colors.textWhite;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = theme.colors.primary;
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: window.innerWidth < 768 ? "block" : "none",
                backgroundColor: "transparent",
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.sm,
                color: theme.colors.primary,
                cursor: "pointer",
                fontSize: theme.typography.fontSize.lg,
                transition: theme.transitions.normal,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.colors.primary;
                e.target.style.color = theme.colors.textWhite;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = theme.colors.primary;
              }}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {user && isMenuOpen && (
        <div
          style={{
            display: window.innerWidth < 768 ? "block" : "none",
            backgroundColor: theme.colors.background,
            borderTop: `1px solid ${theme.colors.border}`,
            padding: theme.spacing.lg,
            boxShadow: theme.shadows.lg,
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.sm,
            }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                isMobile={true}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile User Info & Sign Out */}
            <div
              style={{
                marginTop: theme.spacing.lg,
                paddingTop: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              {userProfile && (
                <div
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                    marginBottom: theme.spacing.md,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontWeight: theme.typography.fontWeight.medium }}
                  >
                    {userProfile.full_name}
                  </div>
                  <div style={{ fontSize: theme.typography.fontSize.xs }}>
                    {userProfile.branch} • {userProfile.year}
                  </div>
                </div>
              )}
              <button
                onClick={handleSignOut}
                style={{
                  width: "100%",
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.textWhite,
                  border: "none",
                  borderRadius: theme.borderRadius.md,
                  padding: `${theme.spacing.md}`,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: "pointer",
                  transition: theme.transitions.normal,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.colors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.colors.primary;
                }}
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
