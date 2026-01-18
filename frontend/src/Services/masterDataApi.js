import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get all class levels
export const getClassLevels = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/class-levels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get class levels API error:", err);
    throw err;
  }
};

// Get all boards
export const getBoards = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/boards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get boards API error:", err);
    throw err;
  }
};

// Get all streams
export const getStreams = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/streams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get streams API error:", err);
    throw err;
  }
};

