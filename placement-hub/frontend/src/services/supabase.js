import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const authService = {
  // Validate email domain
  isValidEmail(email) {
    return email && typeof email === "string" && email.endsWith("@cet.ac.in");
  },

  // Sign up with email and password (restricted to @cet.ac.in)
  async signUpWithEmail(email, password, fullName = "") {
    try {
      if (!this.isValidEmail(email)) {
        throw new Error("Only @cet.ac.in email addresses are allowed");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Email sign up error:", error);
      return { data: null, error };
    }
  },

  // Sign in with email and password
  async signInWithEmail(email, password) {
    try {
      if (!this.isValidEmail(email)) {
        throw new Error("Only @cet.ac.in email addresses are allowed");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Email sign in error:", error);
      return { data: null, error };
    }
  },

  // Sign in with magic link (passwordless)
  async signInWithMagicLink(email) {
    try {
      if (!this.isValidEmail(email)) {
        throw new Error("Only @cet.ac.in email addresses are allowed");
      }

      const redirectUrl = import.meta.env.PROD
        ? "https://cetplacement-app.vercel.app/dashboard"
        : `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Magic link sign in error:", error);
      return { data: null, error };
    }
  },

  // Sign in with Google (restricted to @cet.ac.in) - keeping as backup
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            hd: "cet.ac.in", // Restrict to cet.ac.in domain
          },
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { data: null, error };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // Log the error but don't throw it - we still want to clear local state
        console.warn("Sign out error (continuing anyway):", error);
      }
      return { error: null };
    } catch (error) {
      // Handle cases where the session is already invalid or expired
      console.warn("Sign out error (continuing anyway):", error);

      // Force clear the local session even if the server request fails
      try {
        // Clear any stored tokens/session data locally
        await supabase.auth.signOut({ scope: "local" });
      } catch (localError) {
        console.warn("Local sign out also failed:", localError);
      }

      // Return success even if server sign-out failed
      // This ensures the UI can still update properly
      return { error: null };
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      console.error("Get session error:", error);
      return { session: null, error };
    }
  },

  // Get access token
  async getAccessToken() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return session?.access_token || null;
    } catch (error) {
      console.error("Get access token error:", error);
      return null;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      console.error("Get user error:", error);
      return { user: null, error };
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
