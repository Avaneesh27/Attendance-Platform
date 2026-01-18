import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get all batches
export const getAllBatches = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/batches`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get all batches API error:", err);
    throw err;
  }
};

// Get batch by ID
export const getBatchById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/batches/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get batch by ID API error:", err);
    throw err;
  }
};

// Create a new batch
export const createBatch = async (batchData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/batches`, batchData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Create batch API error:", err);
    throw err;
  }
};

// Update a batch
export const updateBatch = async (id, batchData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/batches/${id}`, batchData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Update batch API error:", err);
    throw err;
  }
};

// Delete a batch
export const deleteBatch = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/batches/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Delete batch API error:", err);
    throw err;
  }
};

// Get batches by institute
export const getBatchesByInstitute = async (instituteId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/batches/institute/${instituteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get batches by institute API error:", err);
    throw err;
  }
};

// Get batches by manager
export const getBatchesByManager = async (managerId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/batches/manager/${managerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get batches by manager API error:", err);
    throw err;
  }
};

