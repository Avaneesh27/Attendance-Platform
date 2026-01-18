import { useState, useEffect } from "react";
import {
  updateStudent,
  deactivateStudent,
  getStudentById,
} from "../Services/studentApi";
import Sidebar from "../Components/Sidebar";

export default function UpdateStudent() {
  const [student, setStudent] = useState(null);
  const [studentId, setStudentId] = useState("");

  const fetchStudent = async () => {
    if (!studentId) {
      alert("Enter Student ID");
      return;
    }
    try {
      const res = await getStudentById(studentId);
      setStudent(res.data);
    } catch {
      alert("Student not found");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* Class → Stream Logic */
  /* Class → Stream Logic */
  useEffect(() => {
    if (!student) return;

    if (student.classLevel === "11" || student.classLevel === "12") {
      // Only update if not already set correctly to avoid infinite loop
      if (student.stream !== "" || student.board !== "") {
        setStudent((prev) => ({ ...prev, stream: "", board: "" }));
      }
    } else {
      if (student.stream !== "Foundation" || student.board !== "") {
        setStudent((prev) => ({
          ...prev,
          stream: "Foundation",
          board: "",
        }));
      }
    }
  }, [student]);

  const handleUpdate = async () => {
    try {
      await updateStudent(student);
      alert("Student updated successfully");
    } catch {
      alert("Update failed");
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateStudent(student.id);
      alert("Student deactivated");
    } catch {
      alert("Deactivation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-4 md:p-6 ml-0 md:ml-56 pt-20 md:pt-6 mt-0">
        <h2 className="text-2xl font-semibold mb-4">Update / Deactivate Student</h2>

        {/* Fetch Student Form */}
        <div className="w-full max-w-md bg-white p-6 rounded shadow mx-auto">
          <div className="flex gap-2 mb-4 flex-col sm:flex-row">
            <input
              placeholder="Student ID"
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1 p-2 border rounded w-full"
            />
            <button
              onClick={fetchStudent}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Fetch
            </button>
          </div>

          {/* Student Form */}
          {student && (
            <div className="space-y-4">
              <input
                name="name"
                value={student.name || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <select
                name="classLevel"
                value={student.classLevel}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
              </select>

              {(student.classLevel === "11" || student.classLevel === "12") && (
                <>
                  <select
                    name="stream"
                    value={student.stream || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Stream</option>
                    <option value="NEET">NEET</option>
                    <option value="JEE">JEE</option>
                  </select>

                  <select
                    name="board"
                    value={student.board || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="STATE">STATE</option>
                  </select>
                </>
              )}

              <input
                name="parent1Mobile"
                value={student.parent1Mobile || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <input
                name="parent2Mobile"
                value={student.parent2Mobile || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                >
                  Update
                </button>

                <button
                  onClick={handleDeactivate}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full sm:w-auto"
                >
                  Deactivate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
