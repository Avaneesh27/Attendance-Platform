import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { getAllStudents } from "../Services/studentApi";
import { getAllBatches } from "../Services/batchApi";

export default function Student() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStream, setSelectedStream] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchBatches();
  }, []);

  const fetchStudents = async () => {
    const res = await getAllStudents();
    setStudents(res.data);
    setFilteredStudents(res.data);
  };

  const fetchBatches = async () => {
    try {
      const res = await getAllBatches();
      setBatches(res.data || []);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  const getBatchName = (batchId) => {
    if (!batchId) return "N/A";
    const batch = batches.find((b) => b.batch_id === batchId);
    return batch ? batch.name : `Batch ${batchId}`;
  };

  const streams = [...new Set(students.map((s) => s.stream))];

  const handleStreamFilter = (e) => {
    const stream = e.target.value;
    setSelectedStream(stream);
    filterStudents(stream, searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterStudents(selectedStream, query);
  };

  const filterStudents = (stream, query) => {
    let filtered = students;
    
    if (stream) {
      filtered = filtered.filter((s) => s.stream === stream);
    }
    
    if (query) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredStudents(filtered);
  };

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

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 p-2 border rounded"
          />
          <select
            value={selectedStream}
            onChange={handleStreamFilter}
            className="p-2 border rounded md:w-48"
          >
            <option value="">All Streams</option>
            {streams.map((stream, index) => (
              <option key={index} value={stream}>
                {stream}
              </option>
            ))}
          </select>
        </div>

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
                    <td className="p-3 border">{getBatchName(student.batch_id)}</td>
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
                  <td colSpan={4} className="p-4 text-center text-gray-500">
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
