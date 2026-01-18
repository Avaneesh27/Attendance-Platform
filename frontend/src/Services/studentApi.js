import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get all students
export const getAllStudents = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get all students API error:", err);
    throw err;
  }
};

// Get students (alias for getAllStudents)
export const getStudents = async () => {
  return getAllStudents();
};

// Add a new student
export const addStudent = async (studentData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/students`, studentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Add student API error:", err);
    throw err;
  }
};

// Update a student
// Can be called as: updateStudent(id, studentData) or updateStudent({id, ...studentData})
export const updateStudent = async (idOrStudent, studentData) => {
  try {
    const token = localStorage.getItem("token");
    let id, data;

    // If only one argument is passed and it contains id, use it
    if (studentData === undefined && idOrStudent && idOrStudent.id) {
      id = idOrStudent.id;
      data = idOrStudent;
    } else {
      // Two arguments: id and studentData
      id = idOrStudent;
      data = studentData;
    }

    const response = await axios.put(`${API_URL}/students/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Update student API error:", err);
    throw err;
  }
};

// Get student by ID
export const getStudentById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get student by ID API error:", err);
    throw err;
  }
};

// Delete a student
export const deleteStudent = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Delete student API error:", err);
    throw err;
  }
};

// Deactivate a student (sets status to INACTIVE)
export const deactivateStudent = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/students/${id}/deactivate`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Deactivate student API error:", err);
    throw err;
  }
};

// Activate a student (sets status to ACTIVE)
export const activateStudent = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/students/${id}/activate`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Activate student API error:", err);
    throw err;
  }
};

// Search students by name or mobile
export const searchStudents = async (searchQuery) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/students/search`, {
      params: { q: searchQuery },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Search students API error:", err);
    throw err;
  }
};

// Get students by stream
export const getStudentsByStream = async (stream) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/students/stream/${stream}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get students by stream API error:", err);
    throw err;
  }
};

// Get inactive students
export const getInactiveStudents = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/students/inactive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get inactive students API error:", err);
    throw err;
  }
};

// Get students by batch
export const getStudentsByBatch = async (batchId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/batches/${batchId}/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get students by batch API error:", err);
    throw err;
  }
};

// Get student by roll number
export const getStudentByRollNo = async (rollNo) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/students/roll/${rollNo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get student by roll number API error:", err);
    throw err;
  }
};

// Note: Attendance functions have been moved to attendApi.js
