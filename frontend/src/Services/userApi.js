// src/Services/userApi.js
import axios from "axios";

// Base URL of your backend API
const API_URL = "http://localhost:5000/api";

// Institute Login
export const loginInstitute = async (loginData) => {
  // loginData should be an object: { email: "", password: "" }
  try {
    const response = await axios.post(`${API_URL}/institute/login`, loginData);
    return response; // response.data should contain institute_id, name, email, token
  } catch (err) {
    console.error("Institute login API error:", err);
    throw err;
  }
};

// Manager Login
export const loginManager = async (loginData) => {
  // loginData should be an object: { email: "", password: "" }
  try {
    const response = await axios.post(`${API_URL}/manager/login`, loginData);
    return response; // response.data should contain manager_id, email, institute_id, token
  } catch (err) {
    console.error("Manager login API error:", err);
    throw err;
  }
};

// Legacy login function (for backward compatibility)
export const loginUser = async (userData) => {
  return loginInstitute(userData);
};

// Register new institute
export const registerInstitute = async (instituteData) => {
  // instituteData should be an object: { name: "", email: "", password: "" }
  try {
    const response = await axios.post(`${API_URL}/institute/register`, instituteData);
    return response;
  } catch (err) {
    console.error("Register institute API error:", err);
    throw err;
  }
};

// Register new manager
export const registerManager = async (managerData) => {
  // managerData should be an object: { email: "", password: "", mobile: "", institute_id: "" }
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/manager/register`, managerData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Register manager API error:", err);
    throw err;
  }
};

// Legacy register function (for backward compatibility)
export const registerUser = async (userData) => {
  return registerInstitute(userData);
};

// Logout function (clears local storage on frontend)
export const logoutUser = () => {
  localStorage.removeItem("coachingName");
  localStorage.removeItem("instituteName");
  localStorage.removeItem("instituteId");
  localStorage.removeItem("managerId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("email");
  localStorage.removeItem("token");
};

// Verify token
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.valid;
  } catch (err) {
    console.error("Verify token API error:", err);
    return false;
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get current user API error:", err);
    throw err;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/auth/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Update user profile API error:", err);
    throw err;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  // passwordData should be: { currentPassword: "", newPassword: "" }
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/auth/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Change password API error:", err);
    throw err;
  }
};

// Forgot password request
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: email,
    });
    return response;
  } catch (err) {
    console.error("Forgot password API error:", err);
    throw err;
  }
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token: token,
      password: newPassword,
    });
    return response;
  } catch (err) {
    console.error("Reset password API error:", err);
    throw err;
  }
};
