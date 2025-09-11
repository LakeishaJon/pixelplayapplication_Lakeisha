/**
 * Authentication Service for Avatar Dashboard
 * Handles Google OAuth2 and traditional login/registration
 */

class AuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_BACKEND_URL || "";
    this.tokenKey = "avatar_access_token";
    this.refreshTokenKey = "avatar_refresh_token";
    this.userKey = "avatar_user_data";
  }

  // Token Management
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setTokens(accessToken, refreshToken) {
    localStorage.setItem(this.tokenKey, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  removeTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  // User Data Management
  getUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  setUser(userData) {
    localStorage.setItem(this.userKey, JSON.stringify(userData));
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // HTTP Request Helper with automatic token handling
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}/api/auth${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      // Handle token expiration
      if (response.status === 401 && token) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          config.headers.Authorization = `Bearer ${this.getToken()}`;
          return await fetch(url, config);
        } else {
          // Refresh failed, redirect to login
          this.logout();
          window.location.href = "/login";
          return null;
        }
      }

      return response;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Traditional Registration
  async register(email, password, username = "") {
    try {
      const response = await this.apiRequest("/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access_token, data.refresh_token);
        this.setUser(data.user);
        return { success: true, user: data.user, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" };
    }
  }

  // Traditional Login
  async login(email, password) {
    try {
      const response = await this.apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access_token, data.refresh_token);
        this.setUser(data.user);
        return { success: true, user: data.user, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" };
    }
  }

  // Google OAuth Login
  initiateGoogleLogin() {
    window.location.href = `${this.baseURL}/api/auth/google-login`;
  }

  // Handle OAuth callback (call this when page loads with auth params)
  handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get("auth");
    const token = urlParams.get("token");
    const message = urlParams.get("message");

    if (authStatus === "success" && token) {
      // OAuth success - store token and fetch user data
      this.setTokens(token);
      this.verifyAndSetUser();

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      return { success: true, message: "Google login successful" };
    } else if (authStatus === "error") {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      return { success: false, error: message || "Google login failed" };
    }

    return null;
  }

  // Verify token and get user data
  async verifyAndSetUser() {
    try {
      const response = await this.apiRequest("/verify-token");

      if (response.ok) {
        const data = await response.json();
        this.setUser(data.user);
        return data.user;
      } else {
        this.logout();
        return null;
      }
    } catch (error) {
      this.logout();
      return null;
    }
  }

  // Refresh Access Token
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access_token);
        this.setUser(data.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  // Logout
  async logout() {
    try {
      // Call logout endpoint to blacklist token
      await this.apiRequest("/logout", { method: "POST" });
    } catch (error) {
      console.log("Logout API call failed, clearing local storage anyway");
    }

    this.removeTokens();
  }

  // Get Current User Profile
  async getProfile() {
    try {
      const response = await this.apiRequest("/profile");

      if (response.ok) {
        const data = await response.json();
        this.setUser(data.user);
        return { success: true, user: data.user };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: "Failed to fetch profile" };
    }
  }

  // Update User Profile
  async updateProfile(profileData) {
    try {
      const response = await this.apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        this.setUser(data.user);
        return { success: true, user: data.user, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: "Failed to update profile" };
    }
  }

  // Change Password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.apiRequest("/change-password", {
        method: "PUT",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: "Failed to change password" };
    }
  }

  // Avatar-specific API calls with authentication
  async updateAvatar(avatarData) {
    const user = this.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      const response = await fetch(`${this.baseURL}/api/avatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          ...avatarData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setUser(data.user);
        return { success: true, user: data.user };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: "Failed to update avatar" };
    }
  }

  async levelUp() {
    const user = this.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      const response = await fetch(
        `${this.baseURL}/api/users/${user.id}/level-up`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.setUser(data.user);
        return { success: true, user: data.user, newLevel: data.newLevel };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: "Failed to level up" };
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();

// React Hook for using auth in components
export const useAuth = () => {
  const [user, setUser] = React.useState(authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    authService.isAuthenticated()
  );

  React.useEffect(() => {
    // Handle OAuth callback on page load
    const oauthResult = authService.handleOAuthCallback();
    if (oauthResult) {
      if (oauthResult.success) {
        setUser(authService.getUser());
        setIsAuthenticated(true);
      }
    }

    // Verify token on app load
    if (authService.isAuthenticated()) {
      authService.verifyAndSetUser().then((userData) => {
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      });
    }
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const register = async (email, password, username) => {
    const result = await authService.register(email, password, username);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const googleLogin = () => {
    authService.initiateGoogleLogin();
  };

  const updateProfile = async (profileData) => {
    const result = await authService.updateProfile(profileData);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    googleLogin,
    updateProfile,
    authService, // Expose service for direct API calls
  };
};

export default authService;
