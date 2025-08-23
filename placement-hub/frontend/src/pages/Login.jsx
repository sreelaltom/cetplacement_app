import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

const Login = () => {
  const { signIn, signUp, signInWithMagicLink, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("signin"); // "signin", "signup", "magic"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.endsWith("@cet.ac.in")) {
      newErrors.email = "Only @cet.ac.in email addresses are allowed";
    }

    if (mode !== "magic") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (mode === "signup") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let result;

      if (mode === "signin") {
        result = await signIn(formData.email, formData.password);
      } else if (mode === "signup") {
        result = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        if (!result.error) {
          alert(
            "Sign up successful! Please check your email to confirm your account."
          );
          setMode("signin");
          setFormData((prev) => ({
            ...prev,
            password: "",
            confirmPassword: "",
            fullName: "",
          }));
          return;
        }
      } else if (mode === "magic") {
        result = await signInWithMagicLink(formData.email);
        if (!result.error) {
          alert(
            "Secure login link has been sent to your email address. Please check your inbox and click the link to access CET Placement Hub. The link will expire in 1 hour for security purposes."
          );
          return;
        }
      }

      if (result?.error) {
        setErrors({ general: result.error.message || "An error occurred" });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
        background: `linear-gradient(135deg, ${theme.colors.primaryLight} 0%, ${theme.colors.secondaryLight} 100%)`,
        padding: theme.spacing.xl,
        [`@media (max-width: ${theme.breakpoints.mobile})`]: {
          padding: theme.spacing.md,
        },
      }}
    >
      <div
        style={{
          maxWidth: "28rem",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.xl,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              margin: `0 auto ${theme.spacing.xl}`,
              height: "4rem",
              width: "4rem",
              backgroundColor: theme.colors.primary,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: theme.shadows.lg,
            }}
          >
            <span
              style={{
                color: theme.colors.textWhite,
                fontWeight: theme.typography.fontWeight.bold,
                fontSize: theme.typography.fontSize.lg,
              }}
            >
              🎓
            </span>
          </div>
          <h2
            style={{
              fontSize:
                window.innerWidth < 768
                  ? theme.typography.fontSize.xl
                  : theme.typography.fontSize["2xl"],
              fontWeight: theme.typography.fontWeight.extrabold,
              color: theme.colors.text,
              marginBottom: theme.spacing.sm,
              lineHeight: theme.typography.lineHeight.tight,
            }}
          >
            {mode === "signup"
              ? "Join CET Placement Hub"
              : "Sign in to CET Placement Hub"}
          </h2>
          <p
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              lineHeight: theme.typography.lineHeight.relaxed,
            }}
          >
            Exclusive access for CET students
          </p>
        </div>

        {/* Main Form Container */}
        <div
          style={{
            ...(theme.commonStyles?.card || {
              backgroundColor: theme.colors.surface,
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.xl,
            }),
            border: `2px solid ${theme.colors.border}`,
          }}
        >
          {/* Mode selector */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#f3f4f6",
                padding: "0.25rem",
                borderRadius: "0.5rem",
              }}
            >
              <button
                onClick={() => setMode("signin")}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: mode === "signin" ? "white" : "transparent",
                  color: mode === "signin" ? "#2563eb" : "#6b7280",
                  boxShadow:
                    mode === "signin"
                      ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                      : "none",
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: mode === "signup" ? "white" : "transparent",
                  color: mode === "signup" ? "#2563eb" : "#6b7280",
                  boxShadow:
                    mode === "signup"
                      ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                      : "none",
                }}
              >
                Create Account
              </button>
              <button
                onClick={() => setMode("magic")}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: mode === "magic" ? "white" : "transparent",
                  color: mode === "magic" ? "#2563eb" : "#6b7280",
                  boxShadow:
                    mode === "magic"
                      ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                      : "none",
                }}
              >
                Login Using Mail
              </button>
            </div>
          </div>

          {/* Error message */}
          {errors.general && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.375rem",
              }}
            >
              <p style={{ fontSize: "0.875rem", color: "#dc2626" }}>
                {errors.general}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.25rem",
                }}
              >
                College Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="yourname@cet.ac.in"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${errors.email ? "#f87171" : "#d1d5db"}`,
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email
                    ? "#f87171"
                    : "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
              {errors.email && (
                <p
                  style={{
                    marginTop: "0.25rem",
                    fontSize: "0.875rem",
                    color: "#dc2626",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Full name field (signup only) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="fullName"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.25rem",
                  }}
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${
                      errors.fullName ? "#f87171" : "#d1d5db"
                    }`,
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    if (!errors.fullName) {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(59, 130, 246, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.fullName
                      ? "#f87171"
                      : "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.fullName && (
                  <p
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.875rem",
                      color: "#dc2626",
                    }}
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>
            )}

            {/* Password fields (not for magic link) */}
            {mode !== "magic" && (
              <>
                <div>
                  <label
                    htmlFor="password"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `1px solid ${
                        errors.password ? "#f87171" : "#d1d5db"
                      }`,
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => {
                      if (!errors.password) {
                        e.target.style.borderColor = "#3b82f6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.password
                        ? "#f87171"
                        : "#d1d5db";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.password && (
                    <p
                      style={{
                        marginTop: "0.25rem",
                        fontSize: "0.875rem",
                        color: "#dc2626",
                      }}
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm password (signup only) */}
                {mode === "signup" && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `1px solid ${
                          errors.confirmPassword ? "#f87171" : "#d1d5db"
                        }`,
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        if (!errors.confirmPassword) {
                          e.target.style.borderColor = "#3b82f6";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(59, 130, 246, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.confirmPassword
                          ? "#f87171"
                          : "#d1d5db";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    {errors.confirmPassword && (
                      <p
                        style={{
                          marginTop: "0.25rem",
                          fontSize: "0.875rem",
                          color: "#dc2626",
                        }}
                      >
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || loading}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0.75rem 1rem",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
                borderRadius: "0.375rem",
                color: "white",
                backgroundColor: isLoading || loading ? "#9ca3af" : "#2563eb",
                cursor: isLoading || loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !loading) {
                  e.target.style.backgroundColor = "#1d4ed8";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !loading) {
                  e.target.style.backgroundColor = "#2563eb";
                }
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
              }}
            >
              {isLoading || loading ? (
                <>
                  <div
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      border: "2px solid transparent",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      marginRight: "0.5rem",
                    }}
                  ></div>
                  Processing...
                </>
              ) : mode === "signup" ? (
                "Create Account"
              ) : mode === "magic" ? (
                "Send Login Link"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Help text */}
          <div style={{ marginTop: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <p>✅ Only @cet.ac.in email addresses are allowed</p>
              <p>
                🔒 Your data is secure and used only for platform functionality
              </p>
              <p>🎓 Exclusive access for CET students and alumni</p>
              {mode === "magic" && (
                <p style={{ color: "#2563eb", fontWeight: "500" }}>
                  Login link provides passwordless sign-in via email
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            padding: "1.5rem",
          }}
        >
          <h4
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#111827",
              marginBottom: "0.75rem",
            }}
          >
            What you'll get access to:
          </h4>
          <ul
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li style={{ display: "flex", alignItems: "center" }}>
              <svg
                style={{
                  height: "1rem",
                  width: "1rem",
                  color: "#10b981",
                  marginRight: "0.5rem",
                  flexShrink: 0,
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Branch-specific study materials and resources
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              <svg
                style={{
                  height: "1rem",
                  width: "1rem",
                  color: "#10b981",
                  marginRight: "0.5rem",
                  flexShrink: 0,
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Company-wise interview experiences
            </li>

            <li style={{ display: "flex", alignItems: "center" }}>
              <svg
                style={{
                  height: "1rem",
                  width: "1rem",
                  color: "#10b981",
                  marginRight: "0.5rem",
                  flexShrink: 0,
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Notes posted by CET students
            </li>
          </ul>
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

export default Login;
