// Centralized theme configuration for consistent design across all pages
// Black + Blue Professional Theme

export const theme = {
  colors: {
    // Base colors - Dark theme
    background: "#0F172A", // slate-900 / almost black
    surface: "#1E293B", // slate-800 - slightly lighter for cards/sections
    surfaceHover: "#334155", // slate-700 - hover state for cards

    // Primary Blue colors
    primary: "#3B82F6", // blue-500
    primaryHover: "#2563EB", // blue-600
    primaryLight: "rgba(59,130,246,0.1)", // blue with 10% opacity
    primaryDark: "#1E40AF", // blue-700

    // Secondary colors (keeping blue variations)
    secondary: "#60A5FA", // blue-400 - lighter blue
    secondaryHover: "#3B82F6", // blue-500
    secondaryLight: "rgba(96,165,250,0.1)", // light blue with opacity

    // Success/Accent (Green)
    accent: "#22C55E", // green-500
    accentHover: "#16A34A", // green-600
    accentLight: "rgba(34,197,94,0.1)", // green with opacity

    // Text colors for dark theme
    text: "#FFFFFF", // white for headings
    textSecondary: "#CBD5E1", // slate-300 / soft gray for body text
    textMuted: "#64748B", // slate-500 for muted text
    textWhite: "#FFFFFF",
    textBlack: "#0F172A", // for text on light backgrounds

    // Status colors
    success: "#22C55E", // green-500
    successHover: "#16A34A", // green-600
    error: "#EF4444", // red-500
    errorHover: "#DC2626", // red-600
    warning: "#F59E0B", // yellow-500
    info: "#3B82F6", // blue-500

    // Border and divider colors for dark theme
    border: "#334155", // slate-700
    borderLight: "#475569", // slate-600
    borderDark: "#1E293B", // slate-800

    // Shadow colors for dark theme
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowMedium: "rgba(0, 0, 0, 0.4)",
    shadowDark: "rgba(0, 0, 0, 0.5)",
  },

  // Responsive breakpoints
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    laptop: "1024px",
    desktop: "1280px",
  },

  // Common spacing values
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Typography
  typography: {
    fontFamily: {
      primary:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      mono: "'Fira Code', 'Monaco', 'Consolas', monospace",
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },

  // Border radius
  borderRadius: {
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Shadows - Enhanced for dark theme
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
  },

  // Transitions
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.2s ease-in-out",
    slow: "0.3s ease-in-out",
  },
};

// Utility functions for responsive design
export const mediaQueries = {
  mobile: `@media (max-width: ${theme.breakpoints.mobile})`,
  tablet: `@media (max-width: ${theme.breakpoints.tablet})`,
  laptop: `@media (max-width: ${theme.breakpoints.laptop})`,
  desktop: `@media (min-width: ${theme.breakpoints.desktop})`,

  // Mobile-first approach
  mobileUp: `@media (min-width: ${theme.breakpoints.mobile})`,
  tabletUp: `@media (min-width: ${theme.breakpoints.tablet})`,
  laptopUp: `@media (min-width: ${theme.breakpoints.laptop})`,
  desktopUp: `@media (min-width: ${theme.breakpoints.desktop})`,
};

// Common component styles
export const commonStyles = {
  // Container with responsive padding
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: `0 ${theme.spacing.md}`,
    [`@media (max-width: ${theme.breakpoints.tablet})`]: {
      padding: `0 ${theme.spacing.sm}`,
    },
  },

  // Card component - Dark theme
  card: {
    backgroundColor: "#1E293B", // slate-800 for card background
    borderRadius: theme.borderRadius.lg,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)", // darker shadow
    border: `1px solid #334155`, // slate-700 border
    padding: theme.spacing.lg,
    transition: theme.transitions.normal,
    [`@media (max-width: ${theme.breakpoints.tablet})`]: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
  },

  // Button styles - Black + Blue Theme
  button: {
    // Primary Blue Button
    primary: {
      backgroundColor: "#3B82F6", // blue-500
      color: "#FFFFFF",
      border: "none",
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: "pointer",
      transition: theme.transitions.normal,
      ":hover": {
        backgroundColor: "#2563EB", // blue-600
      },
      [`@media (max-width: ${theme.breakpoints.tablet})`]: {
        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.sm,
      },
    },

    // Success Green Button
    success: {
      backgroundColor: "#22C55E", // green-500
      color: "#FFFFFF",
      border: "none",
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: "pointer",
      transition: theme.transitions.normal,
      ":hover": {
        backgroundColor: "#16A34A", // green-600
      },
      [`@media (max-width: ${theme.breakpoints.tablet})`]: {
        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.sm,
      },
    },

    // Danger Red Button
    danger: {
      backgroundColor: "#EF4444", // red-500
      color: "#FFFFFF",
      border: "none",
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: "pointer",
      transition: theme.transitions.normal,
      ":hover": {
        backgroundColor: "#DC2626", // red-600
      },
      [`@media (max-width: ${theme.breakpoints.tablet})`]: {
        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.sm,
      },
    },

    // Outline Blue Button
    outline: {
      backgroundColor: "transparent",
      color: "#3B82F6", // blue-500
      border: `2px solid #3B82F6`,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: "pointer",
      transition: theme.transitions.normal,
      ":hover": {
        backgroundColor: "rgba(59,130,246,0.1)", // blue with 10% opacity
        color: "#3B82F6",
      },
      [`@media (max-width: ${theme.breakpoints.tablet})`]: {
        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.sm,
      },
    },

    // Secondary button (keeping for compatibility)
    secondary: {
      backgroundColor: "#60A5FA", // blue-400
      color: "#FFFFFF",
      border: "none",
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: "pointer",
      transition: theme.transitions.normal,
      ":hover": {
        backgroundColor: "#3B82F6", // blue-500
      },
      [`@media (max-width: ${theme.breakpoints.tablet})`]: {
        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.sm,
      },
    },
  },

  // Input styles - Dark theme
  input: {
    backgroundColor: "#1E293B", // slate-800 - darker background for inputs
    border: `2px solid #334155`, // slate-700 border
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.md}`,
    fontSize: theme.typography.fontSize.base,
    color: "#FFFFFF", // white text
    transition: theme.transitions.normal,
    ":focus": {
      borderColor: "#3B82F6", // blue-500
      outline: "none",
      boxShadow: `0 0 0 3px rgba(59,130,246,0.1)`, // blue with opacity
    },
    ":placeholder": {
      color: "#64748B", // slate-500 for placeholder text
    },
    [`@media (max-width: ${theme.breakpoints.tablet})`]: {
      padding: `${theme.spacing.sm}`,
      fontSize: theme.typography.fontSize.sm,
    },
  },

  // Grid layouts
  grid: {
    display: "grid",
    gap: theme.spacing.lg,
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    [`@media (max-width: ${theme.breakpoints.tablet})`]: {
      gridTemplateColumns: "1fr",
      gap: theme.spacing.md,
    },
  },

  // Flex utilities
  flex: {
    center: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    between: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    column: {
      display: "flex",
      flexDirection: "column",
    },
  },
};

export default theme;
