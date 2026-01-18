import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Mark attendance for students
// attendanceData should be: { batch_id, subject_id, attendance_date, attendance_details: [{student_id, status}] }
export const markAttendance = async (attendanceData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/attendance`,
      attendanceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Mark attendance API error:", err);
    throw err;
  }
};

// Mark attendance for a specific date, batch, and subject
// attendanceData should be: { batch_id, subject_id, attendance_date, attendance_details: [{student_id, status}] }
export const markAttendanceByDate = async (attendanceData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/attendance`,
      attendanceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Mark attendance by date API error:", err);
    throw err;
  }
};

// Get attendance records for a specific date, batch, and subject
export const getAttendanceByDate = async (date, batchId = null, subjectId = null) => {
  try {
    const token = localStorage.getItem("token");
    const params = { date };
    if (batchId) params.batch_id = batchId;
    if (subjectId) params.subject_id = subjectId;
    
    const response = await axios.get(`${API_URL}/attendance`, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get attendance by date API error:", err);
    throw err;
  }
};

// Get attendance records for a date range
export const getAttendanceByDateRange = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/attendance/range`, {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get attendance by date range API error:", err);
    throw err;
  }
};

// Get attendance records for a specific student
export const getStudentAttendance = async (studentId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/attendance/student/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Get student attendance API error:", err);
    throw err;
  }
};

// Get attendance statistics for a specific date
export const getAttendanceStatsByDate = async (date) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/attendance/stats/date/${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Get attendance stats by date API error:", err);
    throw err;
  }
};

// Get attendance statistics for a date range
export const getAttendanceStatsByRange = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/attendance/stats/range`, {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get attendance stats by range API error:", err);
    throw err;
  }
};

// Get attendance by stream for a specific date
export const getAttendanceByStream = async (stream, date) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/attendance/stream/${stream}`,
      {
        params: { date: date },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Get attendance by stream API error:", err);
    throw err;
  }
};

// Get overall attendance statistics (all time or for a period)
export const getOverallAttendanceStats = async (startDate = null, endDate = null) => {
  try {
    const token = localStorage.getItem("token");
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(`${API_URL}/attendance/stats/overall`, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Get overall attendance stats API error:", err);
    throw err;
  }
};

// Update attendance record
export const updateAttendance = async (attendanceId, attendanceData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/attendance/${attendanceId}`,
      attendanceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Update attendance API error:", err);
    throw err;
  }
};

// Delete attendance record
export const deleteAttendance = async (attendanceId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/attendance/${attendanceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Delete attendance API error:", err);
    throw err;
  }
};

// Get today's attendance
export const getTodayAttendance = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    return await getAttendanceByDate(today);
  } catch (err) {
    console.error("Get today's attendance API error:", err);
    throw err;
  }
};
