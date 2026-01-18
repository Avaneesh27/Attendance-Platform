import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [coachingName, setCoachingName] = useState(""); 
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle
  const [studentMenuOpen, setStudentMenuOpen] = useState(false);
  const [batchMenuOpen, setBatchMenuOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("coachingName");
    setCoachingName(name || "XYZ Coaching");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("coachingName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-56 bg-blue-700 text-white flex flex-col p-5 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-8">{coachingName}</h2>

        <nav className="flex flex-col gap-2">
          <Link 
            to="/" 
            className="hover:bg-blue-600 p-2 rounded transition"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          
          {/* Student Management - Collapsible */}
          <div>
            <button
              onClick={() => setStudentMenuOpen(!studentMenuOpen)}
              className="w-full hover:bg-blue-600 p-2 rounded transition flex items-center justify-between"
            >
              <span>Students</span>
              <span className="text-sm">
                {studentMenuOpen ? "▼" : "▶"}
              </span>
            </button>
            {studentMenuOpen && (
              <div className="ml-4 mt-2 flex flex-col gap-1">
                <Link 
                  to="/student-management" 
                  className="hover:bg-blue-500 p-2 rounded transition text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Student Management
                </Link>
              </div>
            )}
          </div>

          {/* Batch Management - Collapsible */}
          <div>
            <button
              onClick={() => setBatchMenuOpen(!batchMenuOpen)}
              className="w-full hover:bg-blue-600 p-2 rounded transition flex items-center justify-between"
            >
              <span>Batches</span>
              <span className="text-sm">
                {batchMenuOpen ? "▼" : "▶"}
              </span>
            </button>
            {batchMenuOpen && (
              <div className="ml-4 mt-2 flex flex-col gap-1">
                <Link 
                  to="/batch-management" 
                  className="hover:bg-blue-500 p-2 rounded transition text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Batch Management
                </Link>
              </div>
            )}
          </div>

          <Link 
            to="/attendance" 
            className="hover:bg-blue-600 p-2 rounded transition"
            onClick={() => setIsOpen(false)}
          >
            Attendance
          </Link>
          <Link 
            to="/settings" 
            className="hover:bg-blue-600 p-2 rounded transition"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </>
  );
}
