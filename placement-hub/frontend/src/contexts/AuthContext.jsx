import React, { createContext, useContext, useEffect, useState } from "react";
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
      console.log("Auth state changed:", event, session);
      console.log("User object:", session?.user);
      console.log("User ID:", session?.user?.id);
      console.log("Setting loading to false after auth state change");
      if (session?.user) {
        setUser(session.user);
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
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId, sessionUser = null) => {
    console.log("Fetching user profile for userId:", userId);
    try {
      const { data, error } = await apiService.getUserProfile(userId);
      if (error) {
        console.error("Error fetching user profile:", error);
        console.log("Error response status:", error.response?.status);
        console.log("Error status:", error.status);
        // If profile doesn't exist, create one
        if (error.response?.status === 404 || error.status === 404) {
          console.log("404 detected, creating user profile...");
          await createUserProfile(userId, sessionUser);
        }
      } else {
        console.log("User profile fetched successfully:", data);
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
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
        supabase_uid: userId, // Changed from user_id to supabase_uid
        email: userToUse.email,
        full_name:
          userToUse.user_metadata?.full_name || userToUse.email.split("@")[0],
        branch: "", // Will be set by user
        year: 1,
        points: 0,
      };
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
    if (!user || !userProfile) return { error: "No user logged in" };

    setLoading(true);
    try {
      const { data, error } = await apiService.updateUserProfile(
        user.id,
        profileData
      );
      if (error) {
        console.error("Error updating profile:", error);
        return { error };
      } else {
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
