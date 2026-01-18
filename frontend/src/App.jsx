import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login"; // import your Login component
import Dashboard from "./Pages/Dashboard";
import Students from "./Pages/Student";
import AddStudent from "./Pages/AddStudent";
import Attendance from "./Pages/Attendance";
import UpdateStudent from "./Pages/UpdateStudent";
import ViewStudent from "./Pages/ViewStudent";
import SearchStudent from "./Pages/SearchStudent";
import InactiveStudent from "./Pages/InactiveStudents";
import DeleteStudent from "./Pages/DeleteStudent";
import Settings from "./Pages/Settings";
import StudentManagement from "./Pages/StudentManagement";
import BatchManagement from "./Pages/BatchManagement";
import StudentProfile from "./Pages/StudentProfile";

function App() {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Main app pages */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/add-student" element={<AddStudent />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/update-student" element={<UpdateStudent />} />
      <Route path="/view-student" element={<ViewStudent />} />
      <Route path="/search-student" element={<SearchStudent />} />
      <Route path="/inactive-student" element={<InactiveStudent />} />
      <Route path="/delete-student" element={<DeleteStudent />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/student-management" element={<StudentManagement />} />
      <Route path="/batch-management" element={<BatchManagement />} />
      <Route path="/student-profile/:id" element={<StudentProfile />} />

      {/* Catch-all for wrong routes */}
      <Route
        path="*"
        element={<h2 className="p-8 text-red-500">Page not found</h2>}
      />
    </Routes>
  );
}

export default App;
