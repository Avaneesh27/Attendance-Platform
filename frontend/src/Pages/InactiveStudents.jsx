import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { getAllStudents, updateStudent, deleteStudent } from "../Services/studentApi";

export default function InactiveStudents() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInactiveStudents();
  }, []);

  const fetchInactiveStudents = async () => {
    try {
      const res = await getAllStudents();
      const inactive = res.data.filter(s => s.status === "INACTIVE");
      setStudents(inactive);
    } catch (err) {
      alert("Failed to fetch students");
    }
  };

  const handleActivate = async (student) => {
    try {
      await updateStudent({ ...student, status: "ACTIVE" });
      alert("Student activated successfully");
      fetchInactiveStudents();
    } catch {
      alert("Activation failed");
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete permanently?")) return;
    try {
      await deleteStudent(studentId);
      alert("Student deleted successfully");
      fetchInactiveStudents();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-4 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0">
        <h2 className="text-2xl font-semibold mb-4">Inactive Students</h2>

        {/* Home button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Home
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border-collapse min-w-[600px] md:min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Mobile</th>
                <th className="p-2 text-left">Class</th>
                <th className="p-2 text-left">Stream</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map(student => (
                  <tr key={student.id} className="border-t bg-gray-100 text-gray-400">
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.personalMobile}</td>
                    <td className="p-2">{student.classLevel}</td>
                    <td className="p-2">{student.stream}</td>
                    <td className="p-2 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleActivate(student)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No inactive students found
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
