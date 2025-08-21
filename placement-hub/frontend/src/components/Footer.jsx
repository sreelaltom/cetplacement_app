import React from "react";
import { theme } from "../styles/theme";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: theme.colors.surface,
        borderTop: `1px solid ${theme.colors.border}`,
        padding: `${theme.spacing.lg} ${theme.spacing.md}`,
        marginTop: "auto",
        textAlign: "center",
        boxShadow: theme.shadows.sm,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          color: theme.colors.textSecondary,
          fontSize: theme.typography.fontSize.sm,
          lineHeight: "1.6",
        }}
      >
        <div
          style={{
            marginBottom: theme.spacing.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text,
          }}
        >
          For support or inquiries, please contact:
        </div>

        <div
          style={{
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.primary,
            marginBottom: theme.spacing.xs,
            fontSize: theme.typography.fontSize.base,
          }}
        >
          Sreelal S S
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: theme.spacing.lg,
            flexWrap: "wrap",
            marginBottom: theme.spacing.sm,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
            }}
          >
            <span>📧</span>
            <a
              href="mailto:sssreelal45@gmail.com"
              style={{
                color: theme.colors.text,
                textDecoration: "none",
                transition: theme.transitions.normal,
              }}
              onMouseOver={(e) => {
                e.target.style.color = theme.colors.primary;
                e.target.style.textDecoration = "underline";
              }}
              onMouseOut={(e) => {
                e.target.style.color = theme.colors.text;
                e.target.style.textDecoration = "none";
              }}
            >
              sssreelal45@gmail.com
            </a>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
            }}
          >
            <span>📞</span>
            <a
              href="tel:+918592008405"
              style={{
                color: theme.colors.text,
                textDecoration: "none",
                transition: theme.transitions.normal,
              }}
              onMouseOver={(e) => {
                e.target.style.color = theme.colors.primary;
                e.target.style.textDecoration = "underline";
              }}
              onMouseOut={(e) => {
                e.target.style.color = theme.colors.text;
                e.target.style.textDecoration = "none";
              }}
            >
              +91 8592008405
            </a>
          </div>
        </div>

        <div
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.textSecondary,
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: theme.spacing.sm,
          }}
        >
          © 2025 CET Placement Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
