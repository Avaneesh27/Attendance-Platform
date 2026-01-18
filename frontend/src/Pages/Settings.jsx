import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { getAllBatches } from "../Services/batchApi";
import { getAllSubjects } from "../Services/subjectApi";
import { getAllStudents } from "../Services/studentApi";
import { getCurrentInstitute, updateInstitutePassword } from "../Services/instituteApi";
import { getCurrentUser, changePassword } from "../Services/userApi";

export default function Settings() {
  const navigate = useNavigate();
  const [instituteInfo, setInstituteInfo] = useState({});
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalSubjects: 0,
    totalStudents: 0,
    activeBatches: 0,
  });
  const [loading, setLoading] = useState(true);

  // Password update state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const loadInstituteInfo = async () => {
      try {
        // Try to get full institute details from API
        const res = await getCurrentInstitute();
        if (res.data) {
          setInstituteInfo(res.data);
          // Set logo URL if available
          if (res.data.logo_url || res.data.logo) {
            setLogoUrl(res.data.logo_url || res.data.logo);
          } else {
            // Try to get from localStorage or use default
            const storedLogo = localStorage.getItem("instituteLogo");
            setLogoUrl(storedLogo || "");
          }
        } else {
          // Fallback to localStorage if API fails
          loadFromLocalStorage();
        }
      } catch (err) {
        console.error("Failed to load institute from API, using localStorage:", err);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const instituteId = localStorage.getItem("instituteId");
      const instituteName = localStorage.getItem("instituteName") || localStorage.getItem("coachingName");
      const email = localStorage.getItem("email") || localStorage.getItem("userEmail");
      const storedLogo = localStorage.getItem("instituteLogo");

      setInstituteInfo({
        institute_id: instituteId,
        name: instituteName || "Not Set",
        email: email || "Not Set",
      });
      setLogoUrl(storedLogo || "");
    };

    const loadAllData = async () => {
      setLoading(true);
      try {
        // Load batches
        const batchesRes = await getAllBatches();
        const batchesData = batchesRes.data || [];
        setBatches(batchesData);

        // Load subjects
        const subjectsRes = await getAllSubjects();
        const subjectsData = subjectsRes.data || [];
        setSubjects(subjectsData);

        // Load students
        const studentsRes = await getAllStudents();
        const studentsData = studentsRes.data || [];
        setStudents(studentsData);

        // Calculate stats
        setStats({
          totalBatches: batchesData.length,
          totalSubjects: subjectsData.length,
          totalStudents: studentsData.length,
          activeBatches: batchesData.filter((b) => b.total_strength > 0).length,
        });
      } catch (err) {
        console.error("Error loading data:", err);
        alert("Failed to load some data");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
    loadInstituteInfo();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      // Try institute password update first
      await updateInstitutePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (err) {
      // Fallback to generic changePassword
      try {
        await changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
        alert("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      } catch (error) {
        setPasswordError(
          error.response?.data?.message || "Failed to update password. Please check your current password."
        );
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-3 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2 sm:gap-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Settings</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-blue-700 text-sm md:text-base"
          >
            Home
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Institute Logo and Information Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Institute Logo Box */}
              <div className="lg:col-span-1">
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md h-full">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">
                    Institute Logo
                  </h2>
                  <div className="flex flex-col items-center justify-center p-4 md:p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[200px] md:min-h-[300px]">
                    {logoUrl ? (
                      <div className="w-full">
                        <img
                          src={logoUrl}
                          alt="Institute Logo"
                          className="w-full h-auto max-h-[250px] object-contain rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="hidden flex-col items-center justify-center text-gray-500 mt-4">
                          <svg
                            className="w-24 h-24 mb-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm">Logo not available</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg
                          className="w-24 h-24 mb-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm text-center mb-2">No logo uploaded</p>
                        <p className="text-xs text-gray-400 text-center">
                          Logo will appear here when available
                        </p>
                      </div>
                    )}
                  </div>
                  {instituteInfo.name && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">Institute Name</p>
                      <p className="font-semibold text-lg text-gray-800">
                        {instituteInfo.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Institute Information */}
              <div className="lg:col-span-2">
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                      Institute Information
                    </h2>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-blue-700 transition text-sm md:text-base"
                    >
                      {showPasswordForm ? "Cancel" : "Update Password"}
                    </button>
                  </div>

                  {/* Password Update Form */}
                  {showPasswordForm && (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg border-2 border-blue-200">
                      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-700">
                        Change Password
                      </h3>
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password *
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded focus:outline-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password *
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded focus:outline-blue-500"
                            required
                            minLength={6}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password *
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded focus:outline-blue-500"
                            required
                            minLength={6}
                          />
                        </div>
                        {passwordError && (
                          <div className="text-red-600 text-sm">{passwordError}</div>
                        )}
                        <button
                          type="submit"
                          disabled={passwordLoading}
                          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                          {passwordLoading ? "Updating..." : "Update Password"}
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Institute ID</p>
                      <p className="font-semibold text-lg">
                        {instituteInfo.institute_id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Institute Name</p>
                      <p className="font-semibold text-lg">
                        {instituteInfo.name || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Email</p>
                      <p className="font-semibold text-lg">
                        {instituteInfo.email || "Not Set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Created At</p>
                      <p className="font-semibold text-lg">
                        {instituteInfo.created_at
                          ? new Date(instituteInfo.created_at).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Login Status</p>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Account Type</p>
                      <p className="font-semibold text-lg">Institute</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-blue-50 p-4 md:p-6 rounded-lg shadow">
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">Total Batches</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                  {stats.totalBatches}
                </p>
              </div>
              <div className="bg-green-50 p-4 md:p-6 rounded-lg shadow">
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">Total Subjects</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                  {stats.totalSubjects}
                </p>
              </div>
              <div className="bg-purple-50 p-4 md:p-6 rounded-lg shadow">
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">Total Students</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="bg-orange-50 p-4 md:p-6 rounded-lg shadow">
                <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">Active Batches</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
                  {stats.activeBatches}
                </p>
              </div>
            </div>

            {/* Batches Details */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-800">
                Batches ({batches.length})
              </h2>
              {batches.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left border">Batch ID</th>
                        <th className="p-3 text-left border">Name</th>
                        <th className="p-3 text-left border">Timings</th>
                        <th className="p-3 text-left border">Total Strength</th>
                        <th className="p-3 text-left border">Manager ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map((batch) => (
                        <tr key={batch.batch_id} className="border-t hover:bg-gray-50">
                          <td className="p-3 border">{batch.batch_id}</td>
                          <td className="p-3 border font-semibold">
                            {batch.name}
                          </td>
                          <td className="p-3 border">{batch.timings}</td>
                          <td className="p-3 border">{batch.total_strength}</td>
                          <td className="p-3 border">
                            {batch.manager_id || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No batches found
                </p>
              )}
            </div>

            {/* Subjects Details */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-800">
                Subjects ({subjects.length})
              </h2>
              {subjects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left border">Subject ID</th>
                        <th className="p-3 text-left border">Subject Name</th>
                        <th className="p-3 text-left border">Subject Code</th>
                        <th className="p-3 text-left border">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <tr
                          key={subject.subject_id}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="p-3 border">{subject.subject_id}</td>
                          <td className="p-3 border font-semibold">
                            {subject.subject_name}
                          </td>
                          <td className="p-3 border">
                            {subject.subject_code || "N/A"}
                          </td>
                          <td className="p-3 border">
                            {subject.description || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No subjects found
                </p>
              )}
            </div>

            {/* Students Summary */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-800">
                Students Summary ({students.length})
              </h2>
              {students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left border">Student ID</th>
                        <th className="p-3 text-left border">Name</th>
                        <th className="p-3 text-left border">Roll No</th>
                        <th className="p-3 text-left border">Mobile</th>
                        <th className="p-3 text-left border">Stream</th>
                        <th className="p-3 text-left border">Batch ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(0, 10).map((student) => (
                        <tr
                          key={student.student_id || student.id}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="p-3 border">
                            {student.student_id || student.id}
                          </td>
                          <td className="p-3 border font-semibold">
                            {student.name}
                          </td>
                          <td className="p-3 border">
                            {student.roll_no || "N/A"}
                          </td>
                          <td className="p-3 border">
                            {student.mobile || student.personalMobile || "N/A"}
                          </td>
                          <td className="p-3 border">
                            {student.stream || "N/A"}
                          </td>
                          <td className="p-3 border">
                            {student.batch_id || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {students.length > 10 && (
                    <p className="text-gray-500 text-center py-2 mt-2">
                      Showing first 10 of {students.length} students
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No students found
                </p>
              )}
            </div>

            {/* System Information */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-800">
                System Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Application Version</p>
                  <p className="font-semibold">1.0.0</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Database</p>
                  <p className="font-semibold">MySQL (attendify)</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Last Updated</p>
                  <p className="font-semibold">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">API Base URL</p>
                  <p className="font-semibold text-sm">
                    http://localhost:5000/api
                  </p>
                </div>
              </div>
            </div>

            {/* Local Storage Info */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-800">
                Session Information
              </h2>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(
                    {
                      token: localStorage.getItem("token")
                        ? "***" + localStorage.getItem("token").slice(-10)
                        : "Not set",
                      instituteId: localStorage.getItem("instituteId") || "Not set",
                      instituteName:
                        localStorage.getItem("instituteName") ||
                        localStorage.getItem("coachingName") ||
                        "Not set",
                      email: localStorage.getItem("email") || "Not set",
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
