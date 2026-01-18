import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAllStudents } from "../Services/studentApi";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export default function AttendanceGraph() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [streamAttendance, setStreamAttendance] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState({
    present: 0,
    absent: 0,
    total: 0,
  });

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const res = await getAllStudents();
      const students = res.data || [];

      // Calculate attendance statistics
      // Note: This is a simplified version - you may need to fetch actual attendance records
      let presentCount = 0;
      let absentCount = 0;

      // Group by stream for attendance breakdown
      const streamStats = {};
      
      students.forEach((student) => {
        const stream = student.stream || "Other";
        if (!streamStats[stream]) {
          streamStats[stream] = { present: 0, absent: 0, total: 0 };
        }
        streamStats[stream].total += 1;
        
        // Assuming active students are "present" (you may need to adjust based on your data)
        if (student.status === "ACTIVE" || !student.status) {
          presentCount++;
          streamStats[stream].present += 1;
        } else {
          absentCount++;
          streamStats[stream].absent += 1;
        }
      });

      // Prepare stream attendance data
      const streamData = Object.keys(streamStats).map((stream) => ({
        name: stream,
        present: streamStats[stream].present,
        absent: streamStats[stream].absent,
        total: streamStats[stream].total,
      }));

      setStreamAttendance(streamData);
      setTotalAttendance({
        present: presentCount,
        absent: absentCount,
        total: students.length,
      });

      // Prepare pie chart data
      setAttendanceData([
        { name: "Active/Present", value: presentCount },
        { name: "Inactive/Absent", value: absentCount },
      ]);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setAttendanceData([]);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800">
        Attendance Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-blue-50 p-3 md:p-4 rounded">
          <p className="text-gray-600 text-sm md:text-base">Total Students</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{totalAttendance.total}</p>
        </div>
        <div className="bg-green-50 p-3 md:p-4 rounded">
          <p className="text-gray-600 text-sm md:text-base">Active/Present</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{totalAttendance.present}</p>
        </div>
        <div className="bg-red-50 p-3 md:p-4 rounded">
          <p className="text-gray-600 text-sm md:text-base">Inactive/Absent</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">{totalAttendance.absent}</p>
        </div>
      </div>

      {attendanceData.length > 0 && totalAttendance.total > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-gray-700">Overall Attendance</h3>
            <ResponsiveContainer width="100%" height={200} className="md:h-[250px]">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart by Stream */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-gray-700">Attendance by Stream</h3>
            <ResponsiveContainer width="100%" height={200} className="md:h-[250px]">
              <BarChart data={streamAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name="Active/Present" />
                <Bar dataKey="absent" fill="#ef4444" name="Inactive/Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No attendance data available
        </div>
      )}
    </div>
  );
}