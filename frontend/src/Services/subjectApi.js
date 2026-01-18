import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get all subjects
export const getAllSubjects = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/subjects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get all subjects API error:", err);
    throw err;
  }
};

// Get subject by ID
export const getSubjectById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get subject by ID API error:", err);
    throw err;
  }
};

// Create a new subject
export const createSubject = async (subjectData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/subjects`, subjectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Create subject API error:", err);
    throw err;
  }
};

// Update a subject
export const updateSubject = async (id, subjectData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/subjects/${id}`, subjectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Update subject API error:", err);
    throw err;
  }
};

// Delete a subject
export const deleteSubject = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Delete subject API error:", err);
    throw err;
  }
};

// Get subjects by batch
export const getSubjectsByBatch = async (batchId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/batches/${batchId}/subjects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get subjects by batch API error:", err);
    throw err;
  }
};

// Add subject to batch
export const addSubjectToBatch = async (batchId, subjectId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/batches/${batchId}/subjects`,
      { subject_id: subjectId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Add subject to batch API error:", err);
    throw err;
  }
};

// Remove subject from batch
export const removeSubjectFromBatch = async (batchId, subjectId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_URL}/batches/${batchId}/subjects/${subjectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Remove subject from batch API error:", err);
    throw err;
  }
};

