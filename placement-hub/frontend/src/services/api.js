// Copilot Prompt:
// Create an Axios instance to call Django REST API (hosted separately).
// Include JWT token from Supabase Auth in headers automatically.
// Write functions getSubjects(), getPostsBySubject(id), createPost(data), etc.

import axios from "axios";
import { authService } from "./supabase";

// Create axios instance with base configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add Supabase JWT token for authenticated requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      console.log("API: Making request to:", config.url);

      // Only add auth for specific authenticated endpoints/actions
      const authRequiredEndpoints = ["/users/me"];

      // Check if this is a writing operation (POST, PUT, PATCH, DELETE)
      const isWriteOperation = ["post", "put", "patch", "delete"].includes(
        config.method?.toLowerCase()
      );

      // Check if this is a voting endpoint
      const isVoteEndpoint = config.url?.includes("/vote/");

      // Auth is required for:
      // 1. Specific authenticated endpoints (like /users/me)
      // 2. Any voting endpoints
      // 3. Write operations (creating/updating posts, experiences, etc.)
      const requiresAuth =
        authRequiredEndpoints.some((endpoint) =>
          config.url?.includes(endpoint)
        ) ||
        isVoteEndpoint ||
        isWriteOperation;

      if (requiresAuth) {
        // Get the current session from Supabase
        const { session, error } = await authService.getCurrentSession();

        if (session?.access_token && !error) {
          // Add the JWT token to the Authorization header
          config.headers.Authorization = `Bearer ${session.access_token}`;
          if (import.meta.env.DEV) {
            console.log("API call with auth:", config.url);
          }
        } else {
          if (import.meta.env.DEV) {
            console.log("API call (auth required but no session):", config.url);
            console.log("Session error:", error);
          }
        }
      } else {
        if (import.meta.env.DEV) {
          console.log("API call (no auth required):", config.url);
        }
      }
    } catch (error) {
      console.warn("Failed to get auth token:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const method = error.config?.method?.toLowerCase() || "";

      // Check if this endpoint actually requires authentication
      const authRequiredEndpoints = ["/users/me"];
      const isWriteOperation = ["post", "put", "patch", "delete"].includes(
        method
      );
      const isVoteEndpoint = url.includes("/vote/");

      const shouldRequireAuth =
        authRequiredEndpoints.some((endpoint) => url.includes(endpoint)) ||
        isVoteEndpoint ||
        isWriteOperation;

      if (shouldRequireAuth) {
        console.log("Authentication required for protected endpoint");

        // For voting, let the component handle the error with custom message
        if (isVoteEndpoint) {
          // Don't redirect for voting - let the component show session expired message
          console.log("Voting authentication error - component will handle");
        } else if (!window.location.pathname.includes("/login")) {
          // For other auth-required endpoints, redirect to login
          console.log("Redirecting to login for authenticated endpoint");
          sessionStorage.setItem(
            "redirectAfterLogin",
            window.location.pathname
          );
          window.location.href = "/login";
        }
      } else {
        console.log("401 error on endpoint that should be public:", url);
        // This suggests a backend configuration issue
      }
    }
    return Promise.reject(error);
  }
);

// Utility function to clean parameters
const cleanParams = (params) => {
  const cleaned = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    // Only include non-null, non-undefined, non-empty string values
    // Exclude 'None' strings and other falsy values except 0
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== "None" &&
      value !== "null"
    ) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

// API service functions
const apiService = {
  // Branch APIs
  async getBranches() {
    try {
      console.log("API: Fetching branches");
      const response = await apiClient.get("/branches/");
      console.log("API: Branches response:", response);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("API: Error fetching branches:", error);
      return { data: null, error };
    }
  },

  // User Profile APIs
  async getCurrentUserProfile() {
    const response = await apiClient.get("/users/me/");
    return response.data;
  },

  async getUserProfile(userId) {
    try {
      if (import.meta.env.DEV) {
        console.log("API: Fetching user profile for userId:", userId);
        console.log("API: Making request to:", `/users/${userId}/`);
      }
      const response = await apiClient.get(`/users/${userId}/`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("API: Error fetching user profile:", error);
      return { data: null, error };
    }
  },

  async createUserProfile(profileData) {
    try {
      console.log("API: Creating user profile with data:", profileData);
      const response = await apiClient.post("/users/", profileData);
      console.log("API: User profile created successfully:", response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("API: Error creating user profile:", error);
      return { data: null, error };
    }
  },

  async updateUserProfile(userId, data) {
    try {
      console.log(
        "API: Updating user profile for userId:",
        userId,
        "with data:",
        data
      );
      const response = await apiClient.patch(`/users/${userId}/`, data);
      console.log("API: User profile updated successfully:", response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("API: Error updating user profile:", error);
      return { data: null, error };
    }
  },

  // Subject APIs
  async getSubjects(params = {}) {
    try {
      const cleanedParams = cleanParams(params);
      console.log("Cleaned params for subjects:", cleanedParams);
      const response = await apiClient.get("/subjects/", {
        params: cleanedParams,
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getSubjectsByBranch(branch) {
    try {
      const response = await apiClient.get("/subjects/", {
        params: { branch: branch },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getCommonSubjects() {
    try {
      const response = await apiClient.get("/subjects/", {
        params: { is_common: true },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getSubject(id) {
    try {
      const response = await apiClient.get(`/subjects/${id}/`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getSubjectByName(name, branch = null) {
    try {
      const params = { name: name };
      if (branch) {
        params.branch = branch;
      }
      const response = await apiClient.get("/subjects/", { params });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createSubject(data) {
    try {
      const response = await apiClient.post("/subjects/", data);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getSubjectPosts(subjectId, params = {}) {
    try {
      const response = await apiClient.get(`/subjects/${subjectId}/posts/`, {
        params,
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Post APIs
  async getPosts(params = {}) {
    try {
      const cleanedParams = cleanParams(params);
      console.log("Cleaned params for posts:", cleanedParams);
      const response = await apiClient.get("/posts/", {
        params: cleanedParams,
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getPost(id) {
    try {
      const response = await apiClient.get(`/posts/${id}/`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createPost(data) {
    try {
      const response = await apiClient.post("/posts/", data);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updatePost(id, data) {
    try {
      const response = await apiClient.patch(`/posts/${id}/`, data);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deletePost(id) {
    try {
      await apiClient.delete(`/posts/${id}/`);
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async voteOnPost(postId, vote) {
    try {
      const response = await apiClient.post(`/posts/${postId}/vote/`, { vote });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Company APIs
  async getCompanies(params = {}) {
    try {
      const cleanedParams = cleanParams(params);
      console.log("Cleaned params for companies:", cleanedParams);
      const response = await apiClient.get("/companies/", {
        params: cleanedParams,
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Error fetching companies:", error);
      return { data: null, error };
    }
  },

  async getCompany(id) {
    try {
      const response = await apiClient.get(`/companies/${id}/`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createCompany(data) {
    try {
      const response = await apiClient.post("/companies/", data);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getCompanyExperiences(companyId, params = {}) {
    try {
      const response = await apiClient.get(
        `/companies/${companyId}/experiences/`,
        { params }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Interview Experience APIs
  async getInterviewExperiences(params = {}) {
    try {
      const response = await apiClient.get("/experiences/", { params });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getInterviewExperience(id) {
    try {
      const response = await apiClient.get(`/experiences/${id}/`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createInterviewExperience(data) {
    try {
      const response = await apiClient.post("/experiences/", data);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateInterviewExperience(id, data) {
    try {
      const response = await apiClient.patch(`/experiences/${id}/`, data);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteInterviewExperience(id) {
    try {
      await apiClient.delete(`/experiences/${id}/`);
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async voteOnExperience(experienceId, isUpvote) {
    try {
      const response = await apiClient.post(
        `/experiences/${experienceId}/vote/`,
        { is_upvote: isUpvote }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

export default apiService;
