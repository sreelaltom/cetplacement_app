import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  lazy,
  Suspense,
} from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { theme } from "../styles/theme";

const Dashboard = () => {
  console.log("Dashboard component mounted!");

  // Error Boundary Component
  const ErrorBoundary = memo(({ children, fallback = null }) => {
    const [hasError, setHasError] = useState(false);
    const [errorInfo, setErrorInfo] = useState("");

    useEffect(() => {
      const errorHandler = (error) => {
        console.error("Dashboard Error:", error);
        setHasError(true);
        setErrorInfo(error?.message || "Unknown error occurred");
      };

      window.addEventListener("error", errorHandler);
      window.addEventListener("unhandledrejection", (event) => {
        errorHandler(event.reason);
      });

      return () => {
        window.removeEventListener("error", errorHandler);
        window.removeEventListener("unhandledrejection", errorHandler);
      };
    }, []);

    if (hasError) {
      return (
        fallback || (
          <div
            className="error-boundary"
            style={{
              padding: "20px",
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              border: "1px solid #dc2626",
              borderRadius: "8px",
              color: "#dc2626",
              textAlign: "center",
              margin: "20px",
            }}
          >
            <h3>Something went wrong</h3>
            <p>{errorInfo}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Reload Page
            </button>
          </div>
        )
      );
    }

    return children;
  });

  // Loading component with spinner
  const LoadingSpinner = memo(() => (
    <div
      className="loading-spinner"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        fontSize: "18px",
        color: "#6b7280",
      }}
    >
      <div
        style={{
          border: "3px solid #f3f4f6",
          borderTop: "3px solid #3b82f6",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          animation: "spin 1s linear infinite",
          marginRight: "10px",
        }}
      ></div>
      Loading...
    </div>
  ));

  // Enhanced error handling for API calls
  const safeApiCall = useCallback(
    async (apiFunction, fallbackValue = { data: { results: [] } }) => {
      try {
        const result = await apiFunction();
        return result || fallbackValue;
      } catch (error) {
        console.error("API call failed:", error);
        return fallbackValue;
      }
    },
    []
  );

  const { user, userProfile } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState({
    companies: true,
    posts: true,
    branches: true,
    overall: true,
  });
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [errors, setErrors] = useState({});

  // Company icon function (same as Companies page)
  const getCompanyIcon = (company) => {
    if (!company) return "🏢";
    const name = company.name.toLowerCase();
    if (name.includes("google")) return "🔍";
    if (name.includes("microsoft")) return "🖥️";
    if (name.includes("amazon")) return "📦";
    if (name.includes("apple")) return "🍎";
    if (name.includes("meta") || name.includes("facebook")) return "📘";
    if (name.includes("netflix")) return "🎬";
    if (name.includes("tesla")) return "🚗";
    if (name.includes("uber")) return "🚕";
    if (name.includes("airbnb")) return "🏠";
    if (name.includes("spotify")) return "🎵";
    if (name.includes("tcs")) return "💼";
    if (name.includes("infosys")) return "🌐";
    if (name.includes("wipro")) return "🔧";
    return "🏢";
  };

  // Fetch branches function
  const fetchBranches = useCallback(async () => {
    console.log("Fetching branches...");
    setLoading((prev) => ({ ...prev, branches: true }));
    setErrors((prev) => ({ ...prev, branches: null }));

    const response = await safeApiCall(() => apiService.getBranches());

    console.log("Branches response:", response);
    if (response?.data?.results) {
      console.log("Setting branches:", response.data.results);
      setBranches(response.data.results.map((branch) => branch.name));
    } else {
      console.log("Failed to load branches, using fallback");
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

    setLoading((prev) => ({ ...prev, branches: false }));
  }, []); // Remove safeApiCall dependency

  // Memoize responsive breakpoint check
  const isMobile = useMemo(() => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  }, []);

  // Memoize grid styles for performance
  const gridStyles = useMemo(
    () => ({
      stats: {
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : "repeat(auto-fit, minmax(250px, 1fr))",
        gap: theme.spacing.lg,
        marginBottom: theme.spacing["3xl"],
      },
      companies: {
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : "repeat(auto-fit, minmax(280px, 1fr))",
        gap: theme.spacing.lg,
      },
      posts: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: theme.spacing.xl,
      },
    }),
    [isMobile]
  );

  // Memoize stats
  const stats = useMemo(
    () => ({
      companies: companies.length,
      posts: recentPosts.length,
      points: userProfile?.points || 0,
    }),
    [companies.length, recentPosts.length, userProfile?.points]
  );

  // Individual fetch functions - memoized to prevent unnecessary recreations
  const fetchCompanies = useCallback(async () => {
    console.log("Fetching companies...");
    setLoading((prev) => ({ ...prev, companies: true }));
    setErrors((prev) => ({ ...prev, companies: null }));

    const response = await safeApiCall(() =>
      apiService.getCompanies({ page_size: 6 })
    );

    console.log("Companies response:", response);
    if (response?.data?.results) {
      console.log("Setting companies:", response.data.results);
      setCompanies(response.data.results);
    } else {
      console.log("Failed to load companies, response:", response);
      setErrors((prev) => ({ ...prev, companies: "Failed to load companies" }));
    }

    setLoading((prev) => ({ ...prev, companies: false }));
  }, []); // Remove safeApiCall dependency

  const fetchPosts = useCallback(async () => {
    console.log("Fetching posts...");
    setLoading((prev) => ({ ...prev, posts: true }));
    setErrors((prev) => ({ ...prev, posts: null }));

    const response = await safeApiCall(() =>
      apiService.getPosts({ page_size: 4 })
    );

    console.log("Posts response:", response);
    if (response?.data?.results) {
      console.log("Setting posts:", response.data.results);
      setRecentPosts(response.data.results);
    } else {
      console.log("Failed to load posts, response:", response);
      setErrors((prev) => ({ ...prev, posts: "Failed to load recent posts" }));
    }

    setLoading((prev) => ({ ...prev, posts: false }));
  }, []); // Remove safeApiCall dependency

  // Simplified retry function that reuses individual fetch functions
  const retrySection = useCallback(
    (section) => {
      switch (section) {
        case "companies":
          return fetchCompanies();
        case "posts":
          return fetchPosts();
        case "branches":
          return fetchBranches();
        default:
          return Promise.resolve();
      }
    },
    [] // Remove fetch function dependencies
  );

  useEffect(() => {
    console.log("Dashboard useEffect triggered, userProfile:", userProfile);
    if (userProfile && !userProfile.branch) {
      setShowBranchSelector(true);
    }

    // Only fetch data if we have a userProfile
    if (userProfile) {
      // Call fetchDashboardData directly without dependency issues
      const loadData = async () => {
        console.log("Starting dashboard data fetch...");
        setLoading((prev) => ({ ...prev, overall: true }));

        // Execute all fetches concurrently
        await Promise.allSettled([
          fetchCompanies(),
          fetchPosts(),
          fetchBranches(),
        ]);

        console.log("Dashboard data fetch completed");
        setLoading((prev) => ({ ...prev, overall: false }));
      };

      loadData();
    }

    // Cleanup function to prevent memory leaks
    return () => {
      // Cancel any pending state updates
      setLoading({
        companies: false,
        posts: false,
        branches: false,
        overall: false,
      });
      setErrors({});
    };
  }, [userProfile]); // Only depend on userProfile

  // Memoized helper components for better performance
  const SectionLoader = useMemo(
    () =>
      ({ height = "200px" }) =>
        (
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              padding: theme.spacing.xl,
              height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: `3px solid ${theme.colors.border}`,
                  borderTop: `3px solid ${theme.colors.primary}`,
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: `0 auto ${theme.spacing.md}`,
                }}
              ></div>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                  margin: 0,
                }}
              >
                Loading...
              </p>
            </div>
          </div>
        ),
    []
  );

  const SectionError = useMemo(
    () =>
      ({ message, onRetry, height = "200px" }) =>
        (
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.danger}`,
              padding: theme.spacing.xl,
              height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: theme.colors.danger,
                  fontSize: theme.typography.fontSize.base,
                  margin: `0 0 ${theme.spacing.md} 0`,
                }}
              >
                {message}
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  style={{
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    border: `1px solid ${theme.colors.danger}`,
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: "transparent",
                    color: theme.colors.danger,
                    cursor: "pointer",
                    fontSize: theme.typography.fontSize.sm,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.danger;
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = theme.colors.danger;
                  }}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        ),
    []
  );

  // Show minimal loading only for initial load
  if (
    loading.overall &&
    companies.length === 0 &&
    recentPosts.length === 0 &&
    branches.length === 0
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
          padding: theme.spacing.md,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: `4px solid ${theme.colors.border}`,
              borderTop: `4px solid ${theme.colors.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: `0 auto ${theme.spacing.lg}`,
            }}
          ></div>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Get display name for welcome message
  const displayName =
    userProfile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <ErrorBoundary>
      <div
        style={{
          backgroundColor: theme.colors.background,
          minHeight: "100vh",
          padding: theme.spacing.md,
        }}
      >
        {/* Branch Selection Modal */}
        {showBranchSelector && (
          <BranchSelector
            branches={branches}
            onClose={() => setShowBranchSelector(false)}
            userProfile={userProfile}
          />
        )}

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? theme.spacing.md : theme.spacing.lg,
          }}
        >
          {/* Welcome Section */}
          <div style={{ marginBottom: theme.spacing["3xl"] }}>
            <h1
              style={{
                fontSize: isMobile
                  ? theme.typography.fontSize["2xl"]
                  : theme.typography.fontSize["4xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text,
                margin: `0 0 ${theme.spacing.md} 0`,
                lineHeight: theme.typography.lineHeight.tight,
              }}
            >
              Welcome back, {displayName}! 👋
            </h1>
            <p
              style={{
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.textSecondary,
                margin: 0,
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              Continue your placement preparation journey
            </p>
            {userProfile?.branch && (
              <div
                style={{
                  marginTop: theme.spacing.lg,
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  backgroundColor: theme.colors.primaryLight,
                  borderRadius: theme.borderRadius.lg,
                  display: "inline-block",
                  border: `2px solid ${theme.colors.primary}`,
                }}
              >
                <span
                  style={{
                    color: theme.colors.primary,
                    fontWeight: theme.typography.fontWeight.semibold,
                    fontSize: theme.typography.fontSize.base,
                  }}
                >
                  📚 {userProfile.branch} - Year {userProfile.year} | ⭐ Points:{" "}
                  {userProfile.points}
                </span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div style={gridStyles.stats}>
            <Link
              to="/subject-browser"
              style={{
                textDecoration: "none",
                display: "block",
              }}
            >
              <div
                style={{
                  ...(theme.commonStyles?.card || {
                    backgroundColor: theme.colors.surface,
                    padding: theme.spacing.xl,
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadows.md,
                  }),
                  textAlign: "center",
                  border: `2px solid ${theme.colors.border}`,
                  transition: theme.transitions.normal,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.fontSize["3xl"],
                    marginBottom: theme.spacing.md,
                  }}
                >
                  📚
                </div>
                <h3
                  style={{
                    fontSize: theme.typography.fontSize["2xl"],
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.primary,
                    margin: `0 0 ${theme.spacing.sm} 0`,
                  }}
                >
                  Browse
                </h3>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    margin: 0,
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  Explore Subjects →
                </p>
              </div>
            </Link>

            <div
              style={{
                ...(theme.commonStyles?.card || {
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadows.md,
                }),
                textAlign: "center",
                border: `2px solid ${theme.colors.border}`,
                transition: theme.transitions.normal,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = theme.shadows.lg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
            >
              <div
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  marginBottom: theme.spacing.md,
                }}
              >
                🏢
              </div>
              <h3
                style={{
                  fontSize: theme.typography.fontSize["2xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.secondary,
                  margin: `0 0 ${theme.spacing.sm} 0`,
                }}
              >
                {stats.companies}
              </h3>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  margin: 0,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                Companies Listed
              </p>
            </div>

            <div
              style={{
                ...(theme.commonStyles?.card || {
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadows.md,
                }),
                textAlign: "center",
                border: `2px solid ${theme.colors.border}`,
                transition: theme.transitions.normal,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = theme.shadows.lg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
            >
              <div
                style={{
                  fontSize: theme.typography.fontSize["3xl"],
                  marginBottom: theme.spacing.md,
                }}
              >
                🏆
              </div>
              <h3
                style={{
                  fontSize: theme.typography.fontSize["2xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.accent,
                  margin: `0 0 ${theme.spacing.sm} 0`,
                }}
              >
                {stats.points}
              </h3>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  margin: 0,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                Your Points
              </p>
            </div>
          </div>

          {/* Companies Section */}
          <section style={{ marginBottom: theme.spacing["3xl"] }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.xl,
                flexWrap: "wrap",
                gap: theme.spacing.md,
              }}
            >
              <h2
                style={{
                  fontSize: isMobile
                    ? theme.typography.fontSize.xl
                    : theme.typography.fontSize["2xl"],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                🏢 Top Companies
              </h2>
              <Link
                to="/companies"
                style={{
                  color: theme.colors.secondary,
                  textDecoration: "none",
                  fontWeight: theme.typography.fontWeight.semibold,
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  borderRadius: theme.borderRadius.md,
                  transition: theme.transitions.normal,
                  fontSize: theme.typography.fontSize.sm,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.colors.secondaryLight;
                  e.target.style.color = theme.colors.secondary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = theme.colors.secondary;
                }}
              >
                View All →
              </Link>
            </div>

            <div style={gridStyles.companies}>
              {loading.companies ? (
                // Show loading placeholders
                Array.from({ length: 3 }).map((_, index) => (
                  <SectionLoader
                    key={`company-loader-${index}`}
                    height="180px"
                  />
                ))
              ) : errors.companies ? (
                // Show error state
                <div style={{ gridColumn: "1 / -1" }}>
                  <SectionError
                    message={errors.companies}
                    onRetry={() => retrySection("companies")}
                    height="180px"
                  />
                </div>
              ) : companies.length === 0 ? (
                // Show empty state
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: theme.spacing.xxl,
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.lg,
                      margin: 0,
                    }}
                  >
                    🏢 No companies available yet
                  </p>
                </div>
              ) : (
                // Show actual companies
                companies.map((company) => (
                  <Link
                    key={company.id}
                    to={`/company/${company.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing.xl,
                        border: `1px solid ${theme.colors.border}`,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        height: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 8px 25px ${theme.colors.primary}20`;
                        e.currentTarget.style.borderColor =
                          theme.colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = theme.colors.border;
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
                        <span
                          style={{ fontSize: theme.typography.fontSize.h2 }}
                        >
                          {getCompanyIcon(company)}
                        </span>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              margin: `0 0 ${theme.spacing.xs} 0`,
                              color: theme.colors.text,
                              fontSize: theme.typography.fontSize.xl,
                              fontWeight: theme.typography.fontWeight.bold,
                            }}
                          >
                            {company.name}
                          </h3>
                          {(company.industry ||
                            company.tier ||
                            company.salary_range) && (
                            <p
                              style={{
                                margin: 0,
                                color: theme.colors.textSecondary,
                                fontSize: theme.typography.fontSize.sm,
                                fontWeight: theme.typography.fontWeight.medium,
                              }}
                            >
                              {company.industry ||
                                company.tier ||
                                company.salary_range ||
                                "Company"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.textSecondary,
                          marginTop: "auto",
                          paddingTop: theme.spacing.md,
                          borderTop: `1px solid ${theme.colors.border}`,
                        }}
                      >
                        <span>Click to view details</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Recent Posts */}
          <section>
            <h2
              style={{
                fontSize: theme.typography.fontSize["2xl"],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text,
                marginBottom: theme.spacing.xl,
                margin: `0 0 ${theme.spacing.xl} 0`,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              📝 Recent Posts
            </h2>

            {loading.posts ? (
              <div style={gridStyles.posts}>
                {Array.from({ length: 2 }).map((_, index) => (
                  <SectionLoader key={`post-loader-${index}`} height="200px" />
                ))}
              </div>
            ) : errors.posts ? (
              <SectionError
                message={errors.posts}
                onRetry={() => retrySection("posts")}
                height="200px"
              />
            ) : recentPosts.length > 0 ? (
              <div style={gridStyles.posts}>
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      backgroundColor: theme.colors.surface,
                      padding: theme.spacing.xl,
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadows.md,
                      border: `1px solid ${theme.colors.border}`,
                      transition: theme.transitions.normal,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = theme.shadows.lg;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = theme.shadows.md;
                    }}
                    onClick={() =>
                      (window.location.href = `/subjects/${post.subject}`)
                    }
                  >
                    {/* Header with post type and subject */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing.sm,
                        marginBottom: theme.spacing.md,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor:
                            post.post_type === "notes"
                              ? "#3b82f6"
                              : post.post_type === "video"
                              ? "#ef4444"
                              : post.post_type === "question"
                              ? "#f59e0b"
                              : "#10b981",
                          color: "white",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "1rem",
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.medium,
                        }}
                      >
                        {post.post_type === "notes"
                          ? "📄"
                          : post.post_type === "video"
                          ? "🎥"
                          : post.post_type === "question"
                          ? "❓"
                          : "📝"}{" "}
                        {post.post_type || "question"}
                      </span>

                      {post.subject_name && (
                        <span
                          style={{
                            backgroundColor: theme.colors.primary + "20",
                            color: theme.colors.primary,
                            padding: "0.25rem 0.75rem",
                            borderRadius: "1rem",
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium,
                            border: `1px solid ${theme.colors.primary}40`,
                          }}
                        >
                          📚 {post.subject_name}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.bold,
                        color: theme.colors.text,
                        margin: `0 0 ${theme.spacing.sm} 0`,
                        lineHeight: theme.typography.lineHeight.tight,
                      }}
                    >
                      {post.topic || post.title || "Untitled Post"}
                    </h3>

                    {/* Focus Points */}
                    <p
                      style={{
                        color: theme.colors.textSecondary,
                        lineHeight: theme.typography.lineHeight.relaxed,
                        margin: `0 0 ${theme.spacing.lg} 0`,
                        fontSize: theme.typography.fontSize.base,
                      }}
                    >
                      {post.focus_points
                        ? post.focus_points.length > 150
                          ? post.focus_points.substring(0, 150) + "..."
                          : post.focus_points
                        : "No focus points available"}
                    </p>

                    {/* Footer with author and date */}
                    <div
                      style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.textSecondary,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: `1px solid ${theme.colors.border}`,
                        paddingTop: theme.spacing.md,
                        marginTop: theme.spacing.md,
                      }}
                    >
                      <span>👤 {post.posted_by_name || "Anonymous"}</span>
                      <span>
                        🕒 {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.xxl,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadows.md,
                  textAlign: "center",
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{ fontSize: "3rem", marginBottom: theme.spacing.lg }}
                >
                  📝
                </div>
                <h3
                  style={{
                    fontSize: theme.typography.fontSize.xl,
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.text,
                    margin: `0 0 ${theme.spacing.sm} 0`,
                  }}
                >
                  No posts yet
                </h3>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    margin: 0,
                    fontSize: theme.typography.fontSize.base,
                  }}
                >
                  Be the first to share your knowledge and experiences!
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Branch Selector Component
const BranchSelector = ({ branches, onClose, userProfile }) => {
  const { updateProfile } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBranch) return;

    setLoading(true);
    try {
      const { error } = await updateProfile({
        ...userProfile,
        branch: selectedBranch,
        year: selectedYear,
      });

      if (!error) {
        onClose();
      } else {
        alert("Error updating profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1rem",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#1f2937",
            margin: "0 0 1rem 0",
          }}
        >
          Complete Your Profile
        </h2>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "1.5rem",
            margin: "0 0 1.5rem 0",
          }}
        >
          Please select your branch and year to personalize your experience.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "1rem",
              }}
            >
              <option value="">Select your branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "1rem",
              }}
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedBranch || loading}
            style={{
              width: "100%",
              backgroundColor: "#1e40af",
              color: "white",
              padding: "0.75rem",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: !selectedBranch || loading ? "not-allowed" : "pointer",
              opacity: !selectedBranch || loading ? 0.5 : 1,
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
