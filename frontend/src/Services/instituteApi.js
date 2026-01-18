import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get institute details by ID
export const getInstituteById = async (instituteId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/institute/${instituteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get institute by ID API error:", err);
    throw err;
  }
};

// Get current institute profile
export const getCurrentInstitute = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/institute/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get current institute API error:", err);
    throw err;
  }
};

// Update institute profile
export const updateInstitute = async (instituteId, instituteData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/institute/${instituteId}`,
      instituteData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Update institute API error:", err);
    throw err;
  }
};

// Update institute password
export const updateInstitutePassword = async (passwordData) => {
  // passwordData should be: { currentPassword: "", newPassword: "" }
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/institute/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Update institute password API error:", err);
    throw err;
  }
};

// Get all institutes
export const getAllInstitutes = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/institute`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get all institutes API error:", err);
    throw err;
  }
};

// Delete institute
export const deleteInstitute = async (instituteId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/institute/${instituteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Delete institute API error:", err);
    throw err;
  }
};
