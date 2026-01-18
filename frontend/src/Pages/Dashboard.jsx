import Sidebar from "../Components/Sidebar";
import StudentRegistrationGraph from "../Components/StudentRegistrationGraph";
import AttendanceGraph from "../Components/AttendanceGraph";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-3 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <StudentRegistrationGraph />
          <AttendanceGraph />
        </div>
      </div>
    </div>
  );
}
