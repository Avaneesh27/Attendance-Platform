import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addStudent } from "../Services/studentApi";
import { getAllBatches } from "../Services/batchApi";
import { getClassLevels, getBoards, getStreams } from "../Services/masterDataApi";
import Sidebar from "../Components/Sidebar";

export default function AddStudent() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [boards, setBoards] = useState([]);
  const [streams, setStreams] = useState([]);

  const [student, setStudent] = useState({
    name: "",
    roll_no: "",
    mobile: "",
    alt_mobile: "",
    stream_id: "",  // Changed from stream to stream_id
    dob: "",
    password: "",
    batch_id: "",
    class_level_id: "",  // New field
    board_id: "",  // New field
  });

  useEffect(() => {
    fetchAllMasterData();
    fetchBatches();
  }, []);

  const fetchAllMasterData = async () => {
    try {
      const [classLevelsRes, boardsRes, streamsRes] = await Promise.all([
        getClassLevels(),
        getBoards(),
        getStreams(),
      ]);
      setClassLevels(classLevelsRes.data || []);
      setBoards(boardsRes.data || []);
      setStreams(streamsRes.data || []);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await getAllBatches();
      setBatches(res.data || []);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If class level changes, clear stream_id for classes 8-10
    if (name === "class_level_id") {
      const selectedClassLevel = classLevels.find(cl => cl.class_level_id === parseInt(value));
      const level = selectedClassLevel?.level;
      
      setStudent((prev) => ({
        ...prev,
        [name]: value,
        // Clear stream_id if switching to class 8, 9, or 10
        stream_id: (level >= 8 && level <= 10) ? "" : prev.stream_id,
      }));
    } else {
      setStudent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Check if current class level requires stream (11 or 12)
  const requiresStream = () => {
    if (!student.class_level_id) return false;
    const selectedClassLevel = classLevels.find(
      (cl) => cl.class_level_id === parseInt(student.class_level_id)
    );
    return selectedClassLevel?.level === 11 || selectedClassLevel?.level === 12;
  };

  // Check if current class level is 8, 9, or 10 (stream should be hidden)
  const showStream = requiresStream();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!student.class_level_id) {
      alert("Please select a Class Level");
      return;
    }

    if (!student.board_id) {
      alert("Please select a Board");
      return;
    }

    // Validate stream_id for classes 11-12
    if (requiresStream() && !student.stream_id) {
      alert("Please select a Stream (required for classes 11-12)");
      return;
    }

    // Ensure stream_id is empty/null for classes 8-10
    const submitData = {
      ...student,
      stream_id: showStream ? student.stream_id : null,
    };

    try {
      await addStudent(submitData);
      alert("Student registered successfully");
      navigate("/students");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-3 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0 flex justify-center items-start">
        <div className="w-full max-w-xl bg-white p-4 md:p-6 lg:p-8 rounded shadow">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Add New Student</h2>
            
            {/* Class Level Selection - Must be selected first */}
            <select
              name="class_level_id"
              required
              value={student.class_level_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Class Level *</option>
              {classLevels.map((level) => (
                <option key={level.class_level_id} value={level.class_level_id}>
                  {level.name}
                </option>
              ))}
            </select>

            {/* Student Details */}
            <input
              name="name"
              placeholder="Student Name *"
              required
              value={student.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <input
              name="roll_no"
              placeholder="Roll Number *"
              required
              value={student.roll_no}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <input
              name="mobile"
              type="tel"
              placeholder="Mobile Number *"
              required
              value={student.mobile}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <input
              name="alt_mobile"
              type="tel"
              placeholder="Alternate Mobile Number"
              value={student.alt_mobile}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <input
              name="dob"
              type="date"
              placeholder="Date of Birth"
              value={student.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            {/* Board Selection - Always visible and mandatory */}
            <select
              name="board_id"
              required
              value={student.board_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Board *</option>
              {boards
                .filter((board) => board.is_active !== false)
                .map((board) => (
                  <option key={board.board_id} value={board.board_id}>
                    {board.name}
                  </option>
                ))}
            </select>

            {/* Stream Selection - Only visible for classes 11-12 */}
            {showStream && (
              <select
                name="stream_id"
                required={showStream}
                value={student.stream_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Stream *</option>
                {streams
                  .filter((stream) => stream.is_active !== false)
                  .map((stream) => (
                    <option key={stream.stream_id} value={stream.stream_id}>
                      {stream.name}
                    </option>
                  ))}
              </select>
            )}

            <select
              name="batch_id"
              required
              value={student.batch_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Batch *</option>
              {batches.map((batch) => (
                <option key={batch.batch_id} value={batch.batch_id}>
                  {batch.name} - {batch.timings}
                </option>
              ))}
            </select>

            <input
              name="password"
              type="password"
              placeholder="Password (for student login)"
              value={student.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Register Student
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
