import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents } from "../Services/studentApi";
import { markAttendance } from "../Services/attendApi";
import Sidebar from "../Components/Sidebar";

export default function Attendance() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedBatch, setSelectedBatch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await getStudents();
      const data = res.data || [];
      setStudents(data);

      const initAttendance = {};
      data.forEach((s) => {
        initAttendance[s.id] = "PRESENT";
      });
      setAttendance(initAttendance);
    } catch (err) {
      alert("Failed to load students");
    }
  };

  const batches = [...new Set(students.map((s) => s.stream))];
  const filteredStudents = selectedBatch
    ? students.filter((s) => s.stream === selectedBatch)
    : students;

  const handleChange = (id, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const filteredAttendance = {};
      filteredStudents.forEach((s) => {
        filteredAttendance[s.id] = attendance[s.id];
      });
      await markAttendance(filteredAttendance);
      alert("Attendance marked successfully");
    } catch (err) {
      alert("Failed to mark attendance");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-4 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
          <h2 className="text-xl md:text-2xl font-semibold">Mark Attendance</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Home
          </button>
        </div>

        <div className="bg-white p-4 md:p-6 rounded shadow">
          {/* Batch Selector */}
          <div className="mb-4 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <label className="font-medium">Select Batch / Stream:</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="border p-2 rounded w-full md:w-auto"
            >
              <option value="">All</option>
              {batches.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 min-w-[600px] md:min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Stream</th>
                  <th className="p-2 border">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      className={`text-center ${
                        s.status === "INACTIVE" ? "bg-gray-200 text-gray-400" : ""
                      }`}
                    >
                      <td className="p-2 border">{s.name}</td>
                      <td className="p-2 border">{s.classLevel}</td>
                      <td className="p-2 border">{s.stream}</td>
                      <td className="p-2 border">
                        <select
                          value={attendance[s.id] || "PRESENT"}
                          onChange={(e) => handleChange(s.id, e.target.value)}
                          className="border p-1 rounded"
                          disabled={s.status === "INACTIVE"}
                        >
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
