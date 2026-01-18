import { Routes, Route, Navigate } from "react-router-dom";
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
import AdminDashboard from "./Pages/AdminDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Main app pages - Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-student"
        element={
          <ProtectedRoute>
            <AddStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-student"
        element={
          <ProtectedRoute>
            <UpdateStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-student"
        element={
          <ProtectedRoute>
            <ViewStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search-student"
        element={
          <ProtectedRoute>
            <SearchStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inactive-student"
        element={
          <ProtectedRoute>
            <InactiveStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delete-student"
        element={
          <ProtectedRoute>
            <DeleteStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-management"
        element={
          <ProtectedRoute>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/batch-management"
        element={
          <ProtectedRoute>
            <BatchManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-profile/:id"
        element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard for User Role */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all for wrong routes */}
      <Route
        path="*"
        element={<h2 className="p-8 text-red-500">Page not found</h2>}
      />
    </Routes>
  );
}

export default App;
