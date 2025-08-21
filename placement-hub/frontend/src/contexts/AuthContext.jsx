import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { supabase, authService } from "../services/supabase";
import apiService from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastProcessedSession, setLastProcessedSession] = useState(null);

  // Use useRef for cache to prevent re-renders from clearing it
  const profileFetchCacheRef = React.useRef(new Map());
  const lastFetchTimeRef = React.useRef(0);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          setLastProcessedSession(session.access_token);
          // Validate email domain
          if (!authService.isValidEmail(session.user.email)) {
            await authService.signOut();
            setUser(null);
            alert("Only @cet.ac.in email addresses are allowed.");
            setLoading(false);
            return;
          }
          // Get user profile
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (import.meta.env.DEV) {
        console.log("Auth state changed:", event, session?.user?.email);
      }

      // Skip processing if this is the same session we already processed
      if (
        session?.access_token &&
        lastProcessedSession &&
        session.user?.id === user?.id &&
        userProfile?.supabase_uid === session.user?.id
      ) {
        if (import.meta.env.DEV) {
          console.log("Skipping duplicate session processing for same user");
        }
        setLastProcessedSession(session.access_token);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        setLastProcessedSession(session.access_token);
        // Validate email domain
        if (!authService.isValidEmail(session.user.email)) {
          await authService.signOut();
          setUser(null);
          setUserProfile(null);
          alert("Only @cet.ac.in email addresses are allowed.");
          setLoading(false);
          return;
        }
        // Get user profile - pass the session user directly
        await fetchUserProfile(session.user.id, session.user);
      } else {
        setUser(null);
        setUserProfile(null);
        setLastProcessedSession(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId, sessionUser = null) => {
    // Check if we already have a profile with this supabase_uid
    if (userProfile && userProfile.supabase_uid === userId) {
      if (import.meta.env.DEV) {
        console.log("Profile already loaded for:", userId);
      }
      return userProfile;
    }

    // Debounce rapid successive calls (prevent calls within 100ms)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 100) {
      if (import.meta.env.DEV) {
        console.log("Debouncing profile fetch - too soon after last call");
      }
      return userProfile;
    }
    lastFetchTimeRef.current = now;

    // Check if there's already a fetch in progress for this user
    if (profileFetchCacheRef.current.has(userId)) {
      if (import.meta.env.DEV) {
        console.log(
          "Profile fetch already in progress for:",
          userId,
          "- waiting for existing request"
        );
      }
      // Return the existing promise
      return await profileFetchCacheRef.current.get(userId);
    }

    if (import.meta.env.DEV) {
      console.log("Starting NEW profile fetch for userId:", userId);
    }

    // Create a promise for this fetch and store it in cache
    const fetchPromise = (async () => {
      try {
        const { data, error } = await apiService.getUserProfile(userId);
        if (error) {
          console.error("Error fetching user profile:", error);
          if (import.meta.env.DEV) {
            console.log("Error response status:", error.response?.status);
          }
          // If profile doesn't exist, create one (handle both 404 and 500 errors)
          if (
            error.response?.status === 404 ||
            error.status === 404 ||
            error.response?.status === 500 ||
            error.status === 500
          ) {
            if (import.meta.env.DEV) {
              console.log(
                "Profile not found or server error, creating user profile..."
              );
            }
            await createUserProfile(userId, sessionUser);
          }
          return null;
        } else {
          if (import.meta.env.DEV) {
            console.log("User profile fetched successfully:", data.email);
          }
          setUserProfile(data);
          return data;
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
        return null;
      } finally {
        // Remove from cache after fetch completes
        profileFetchCacheRef.current.delete(userId);
      }
    })();

    // Store the promise in cache
    profileFetchCacheRef.current.set(userId, fetchPromise);

    return await fetchPromise;
  };

  const createUserProfile = async (userId, sessionUser = null) => {
    try {
      console.log("Creating user profile for userId:", userId);
      console.log("Session user object:", sessionUser);
      console.log("State user object:", user);

      // Use sessionUser if provided, otherwise fall back to state user
      const userToUse = sessionUser || user;

      if (!userToUse) {
        console.error("No user object available for profile creation");
        return;
      }

      const profileData = {
        supabase_uid: userId,
        email: userToUse.email,
        full_name:
          userToUse.user_metadata?.full_name ||
          userToUse.email.split("@")[0] ||
          "New User",
        branch: "", // Will be set by user
        year: 1,
        points: 0,
      };

      // Validate required fields
      if (!profileData.email || !profileData.supabase_uid) {
        console.error(
          "Missing required fields for profile creation:",
          profileData
        );
        return;
      }

      console.log("Profile data to send:", profileData);

      const { data, error } = await apiService.createUserProfile(profileData);
      if (error) {
        console.error("Error creating user profile:", error);
      } else {
        console.log("User profile created successfully:", data);
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error in createUserProfile:", error);
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, fullName) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signUpWithEmail(
        email,
        password,
        fullName
      );
      if (error) {
        console.error("Sign up error:", error);
        return { error };
      }
      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signInWithEmail(
        email,
        password
      );
      if (error) {
        console.error("Sign in error:", error);
        return { error };
      }
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with magic link
  const signInWithMagicLink = async (email) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signInWithMagicLink(email);
      if (error) {
        console.error("Magic link error:", error);
        return { error };
      }
      return { data, error: null };
    } catch (error) {
      console.error("Magic link error:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await authService.signOut();
      if (error) {
        console.error("Sign out error:", error);
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!user || !userProfile) {
      console.error("updateProfile: No user or userProfile available");
      return { error: "No user logged in" };
    }

    console.log(
      "updateProfile: Updating profile for supabase_uid:",
      userProfile.supabase_uid,
      "with data:",
      profileData
    );
    setLoading(true);
    try {
      const { data, error } = await apiService.updateUserProfile(
        userProfile.supabase_uid,
        profileData
      );
      if (error) {
        console.error("Error updating profile:", error);
        return { error };
      } else {
        console.log("Profile updated successfully:", data);
        setUserProfile(data);
        return { data, error: null };
      }
    } catch (error) {
      console.error("Error in updateProfile:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    if (user) {
      fetchUserProfile(user.id);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithMagicLink,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
