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
      // Temporarily disable auth to debug the hanging issue
      console.log("API call (auth temporarily disabled):", config.url);

      // // Get the current session from Supabase
      // const { session, error } = await authService.getCurrentSession();

      // if (session?.access_token && !error) {
      //   // Add the JWT token to the Authorization header
      //   config.headers.Authorization = `Bearer ${session.access_token}`;
      //   console.log("API call with auth:", config.url);
      // } else {
      //   console.log("API call (no auth):", config.url);
      //   console.log("Session error:", error);
      // }
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
    if (error.response?.status === 401) {
      // Only redirect to login for non-API requests or critical auth failures
      // For voting and other user actions, let the component handle the error
      const url = error.config?.url || "";
      if (!url.includes("/vote/") && !url.includes("/posts/")) {
        // Handle unauthorized access - redirect to login
        window.location.href = "/login";
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
      console.log("API: Fetching user profile for userId:", userId);
      const response = await apiClient.get(`/users/${userId}/`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error("API: Error fetching user profile:", error);
      return { data: null, error };
    }
  },

  async createUserProfile(profileData) {
    try {
      const response = await apiClient.post("/users/", profileData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateUserProfile(userId, data) {
    try {
      const response = await apiClient.patch(`/users/${userId}/`, data);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getLeaderboard() {
    const response = await apiClient.get("/users/leaderboard/");
    return response.data;
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
