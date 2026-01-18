import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { getAllStudents } from "../Services/studentApi";

export default function SearchStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Fetch all students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      alert("Failed to fetch students");
    }
  };

  // Search by name
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-4 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">View & Search Students</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Home
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Student Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left border">Name</th>
                <th className="p-3 text-left border">Batch</th>
                <th className="p-3 text-left border">Stream</th>
                <th className="p-3 text-left border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.student_id || student.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 border font-semibold">{student.name}</td>
                    <td className="p-3 border">{student.batch_id || "N/A"}</td>
                    <td className="p-3 border">{student.stream || "N/A"}</td>
                    <td className="p-3 border">
                      <button
                        onClick={() => navigate(`/student-profile/${student.student_id || student.id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-500"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
