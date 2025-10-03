// auth.js - Authentication utility functions for PixelPlay

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Token storage keys
const TOKEN_KEY = "pixelplay_token";
const REFRESH_TOKEN_KEY = "pixelplay_refresh_token";
const USER_KEY = "pixelplay_user";

/**
 * Get authentication token from storage
 * @returns {string|null} JWT token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Get refresh token from storage
 * @returns {string|null} Refresh token or null if not found
 */
export const getRefreshToken = () => {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
};

/**
 * Store authentication tokens
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token (optional)
 * @param {boolean} remember - Whether to use localStorage (true) or sessionStorage (false)
 */
export const setAuthTokens = (accessToken, refreshToken, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;
  
  storage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Remove authentication tokens from storage
 */
export const removeAuthTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/**
 * Store user data in local storage
 * @param {object} user - User data object
 */
export const setUserData = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data from storage
 * @returns {object|null} User data or null if not found
 */
export const getUserData = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // Check if token is expired (basic check)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} remember - Whether to remember login
 * @returns {Promise<object>} Login response
 */
export const login = async (email, password, remember = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.success && data.access_token) {
      // Store tokens
      setAuthTokens(data.access_token, data.refresh_token, remember);

      // Store user data if provided
      if (data.user) {
        setUserData(data.user);
      }

      return {
        success: true,
        user: data.user,
        message: data.message || "Login successful",
      };
    } else {
      throw new Error(data.message || "Invalid response from server");
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
};

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Promise<object>} Registration response
 */
export const register = async (email, password, confirmPassword) => {
  try {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (data.success) {
      return {
        success: true,
        message: data.message || "Registration successful",
      };
    } else {
      throw new Error(data.message || "Invalid response from server");
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "Registration failed",
    };
  }
};

/**
 * Logout user and clear all stored data
 * @returns {Promise<object>} Logout response
 */
export const logout = async () => {
  try {
    const token = getAuthToken();

    if (token) {
      // Attempt to logout on server (optional)
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.warn(
          "Server logout failed, proceeding with local logout:",
          error
        );
      }
    }

    // Clear local storage regardless of server response
    removeAuthTokens();

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear local storage even if server logout fails
    removeAuthTokens();
    return {
      success: true,
      message: "Logged out locally",
    };
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<string|null>} New access token or null if refresh failed
 */
export const refreshAuthToken = async () => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Token refresh failed");
    }

    if (data.success && data.access_token) {
      // Update stored token
      const currentRefreshToken = getRefreshToken();
      const remember = localStorage.getItem(TOKEN_KEY) !== null;
      setAuthTokens(data.access_token, currentRefreshToken, remember);

      return data.access_token;
    } else {
      throw new Error("Invalid refresh response");
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    // If refresh fails, user needs to login again
    removeAuthTokens();
    return null;
  }
};

/**
 * Make authenticated API request with automatic token refresh
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
  let token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token available");
  }

  // Prepare headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  // Make initial request
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If token expired, try to refresh and retry
  if (response.status === 401) {
    const newToken = await refreshAuthToken();

    if (newToken) {
      // Retry with new token
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    } else {
      // Refresh failed, redirect to login
      throw new Error("Authentication expired. Please login again.");
    }
  }

  return response;
};

/**
 * Get current user profile
 * @returns {Promise<object>} User profile data
 */
export const getCurrentUser = async () => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/auth/profile`);
    const data = await response.json();

    if (data.success) {
      setUserData(data.profile);
      return data.profile;
    } else {
      throw new Error(data.message || "Failed to get user profile");
    }
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {object} profileData - Profile data to update
 * @returns {Promise<object>} Update response
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (data.success) {
      setUserData(data.profile);
      return {
        success: true,
        profile: data.profile,
        message: data.message || "Profile updated successfully",
      };
    } else {
      throw new Error(data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
};

/**
 * Check authentication status and redirect if needed
 * @param {string} redirectPath - Path to redirect to if not authenticated
 */
export const requireAuth = (redirectPath = "/login") => {
  if (!isAuthenticated()) {
    window.location.href = redirectPath;
    return false;
  }
  return true;
};

/**
 * Get auth headers for manual API calls
 * @returns {object} Authorization headers
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
};

// Auto-logout on token expiration
let logoutTimer = null;

/**
 * Set up automatic logout when token expires
 */
export const setupAutoLogout = () => {
  const token = getAuthToken();

  if (token && logoutTimer) {
    clearTimeout(logoutTimer);
  }

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const timeUntilExpiry = payload.exp * 1000 - Date.now();

      if (timeUntilExpiry > 0) {
        logoutTimer = setTimeout(() => {
          logout();
          window.location.href = "/login?message=Session expired";
        }, timeUntilExpiry);
      }
    } catch (error) {
      console.error("Error setting up auto-logout:", error);
    }
  }
};

// Initialize auto-logout when module loads
if (typeof window !== "undefined") {
  setupAutoLogout();
}

export default {
  getAuthToken,
  setAuthTokens,
  removeAuthTokens,
  setUserData,
  getUserData,
  isAuthenticated,
  login,
  register,
  logout,
  refreshAuthToken,
  authenticatedFetch,
  getCurrentUser,
  updateUserProfile,
  requireAuth,
  getAuthHeaders,
  setupAutoLogout,
};