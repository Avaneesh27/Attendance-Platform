import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { getAllStudents, updateStudent } from "../Services/studentApi";

export default function ViewStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStream, setSelectedStream] = useState("");
  const [viewStudent, setViewStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await getAllStudents();
    setStudents(res.data);
    setFilteredStudents(res.data);
  };

  const handleStreamFilter = (e) => {
    const stream = e.target.value;
    setSelectedStream(stream);
    setFilteredStudents(stream ? students.filter((s) => s.stream === stream) : students);
  };

  const toggleStatus = async (student) => {
    try {
      const newStatus = student.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateStudent({ ...student, status: newStatus });
      alert(`Student ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`);
      fetchStudents();
      if (viewStudent && viewStudent.id === student.id) {
        setViewStudent({ ...student, status: newStatus });
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const streams = [...new Set(students.map((s) => s.stream))];

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-4 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0">
        <h2 className="text-2xl font-semibold mb-4">Student List</h2>

        {/* Stream Filter */}
        <div className="mb-4">
          <select
            value={selectedStream}
            onChange={handleStreamFilter}
            className="p-2 border rounded w-full md:w-1/2"
          >
            <option value="">All Streams</option>
            {streams.map((stream, index) => (
              <option key={index} value={stream}>{stream}</option>
            ))}
          </select>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border-collapse min-w-[600px] md:min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Mobile</th>
                <th className="p-2 text-left">Class</th>
                <th className="p-2 text-left">Stream</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.personalMobile}</td>
                  <td className="p-2">{student.classLevel}</td>
                  <td className="p-2">{student.stream}</td>
                  <td className="p-2">{student.status}</td>
                  <td className="p-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigate(`/student-profile/${student.student_id || student.id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition w-full sm:w-auto"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => toggleStatus(student)}
                      className={`px-2 py-1 rounded w-full sm:w-auto ${student.status === "ACTIVE"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                    >
                      {student.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
