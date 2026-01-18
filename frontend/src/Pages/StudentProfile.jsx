import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { getStudentById } from "../Services/studentApi";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchStudentProfile();
    }
  }, [id]);

  const fetchStudentProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getStudentById(id);
      setStudent(res.data);
    } catch (err) {
      setError("Failed to load student profile");
      console.error("Error fetching student:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="p-4 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0">
          <div className="text-center py-8">Loading student profile...</div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="p-3 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6 text-center">
            <p className="text-red-600 mb-3 md:mb-4 text-sm md:text-base">{error || "Student not found"}</p>
            <button
              onClick={() => navigate("/student-management")}
              className="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-blue-700 text-sm md:text-base"
            >
              Back to Student Management
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-3 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2 sm:gap-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Student Profile</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/student-management")}
              className="bg-gray-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-gray-700 text-sm md:text-base"
            >
              Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-blue-700 text-sm md:text-base"
            >
              Home
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl md:text-3xl font-bold">
                {student.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{student.name}</h2>
                <p className="text-blue-100 text-sm md:text-base">
                  {student.roll_no ? `Roll No: ${student.roll_no}` : `ID: ${student.student_id || student.id}`}
                </p>
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Basic Information
                </h3>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Student ID</p>
                  <p className="font-semibold text-lg">
                    {student.student_id || student.id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Roll Number</p>
                  <p className="font-semibold text-lg">
                    {student.roll_no || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Name</p>
                  <p className="font-semibold text-lg">{student.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Date of Birth</p>
                  <p className="font-semibold text-lg">
                    {student.dob
                      ? new Date(student.dob).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Stream</p>
                  <p className="font-semibold text-lg">
                    {student.stream || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Status</p>
                  <p
                    className={`font-semibold text-lg ${
                      (student.status === "ACTIVE" || !student.status)
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {student.status || "ACTIVE"}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Contact Information
                </h3>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Mobile Number</p>
                  <p className="font-semibold text-lg">
                    {student.mobile || student.personalMobile || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Alternate Mobile</p>
                  <p className="font-semibold text-lg">
                    {student.alt_mobile || "N/A"}
                  </p>
                </div>
                {student.fatherMobile && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Father Mobile</p>
                    <p className="font-semibold text-lg">
                      {student.fatherMobile}
                    </p>
                  </div>
                )}
                {student.motherMobile && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Mother Mobile</p>
                    <p className="font-semibold text-lg">
                      {student.motherMobile}
                    </p>
                  </div>
                )}
                {student.parent1Mobile && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Parent 1 Mobile</p>
                    <p className="font-semibold text-lg">
                      {student.parent1Mobile}
                    </p>
                  </div>
                )}
                {student.parent2Mobile && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Parent 2 Mobile</p>
                    <p className="font-semibold text-lg">
                      {student.parent2Mobile}
                    </p>
                  </div>
                )}
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Academic Information
                </h3>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Batch ID</p>
                  <p className="font-semibold text-lg">
                    {student.batch_id || "N/A"}
                  </p>
                </div>
                {student.classLevel && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Class Level</p>
                    <p className="font-semibold text-lg">
                      {student.classLevel}
                    </p>
                  </div>
                )}
                {student.board && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Board</p>
                    <p className="font-semibold text-lg">{student.board}</p>
                  </div>
                )}
                {student.schoolType && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">School Type</p>
                    <p className="font-semibold text-lg">
                      {student.schoolType}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Parent Information */}
            {(student.fatherName ||
              student.motherName ||
              student.fatherMobile ||
              student.motherMobile) && (
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
                  Parent Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {student.fatherName && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Father Name</p>
                      <p className="font-semibold text-lg">
                        {student.fatherName}
                      </p>
                    </div>
                  )}
                  {student.fatherMobile && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Father Mobile
                      </p>
                      <p className="font-semibold text-lg">
                        {student.fatherMobile}
                      </p>
                    </div>
                  )}
                  {student.motherName && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Mother Name</p>
                      <p className="font-semibold text-lg">
                        {student.motherName}
                      </p>
                    </div>
                  )}
                  {student.motherMobile && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Mother Mobile
                      </p>
                      <p className="font-semibold text-lg">
                        {student.motherMobile}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={() => navigate(`/update-student`)}
                className="bg-yellow-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded hover:bg-yellow-700 text-sm md:text-base"
              >
                Update Student
              </button>
              <button
                onClick={() => navigate(`/students`)}
                className="bg-blue-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded hover:bg-blue-700 text-sm md:text-base"
              >
                Back to Students
              </button>
              <button
                onClick={() => navigate(`/student-management`)}
                className="bg-gray-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded hover:bg-gray-700 text-sm md:text-base"
              >
                Student Management
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
