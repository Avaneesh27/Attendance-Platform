import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { deleteStudent } from "../Services/studentApi";

export default function DeleteStudent() {
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!studentId) {
      alert("Please enter Student ID");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await deleteStudent(studentId);
      alert("Student deleted successfully");
      navigate("/students");
    } catch (error) {
      alert("Failed to delete student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-4 md:p-6 ml-0 md:ml-56 pt-20 md:pt-6 mt-0">
        <div className="max-w-md bg-white p-6 rounded shadow mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            Delete Student
          </h2>

          <input
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <button
            onClick={handleDelete}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Delete Student
          </button>
        </div>
      </div>
    </div>
  );
}
