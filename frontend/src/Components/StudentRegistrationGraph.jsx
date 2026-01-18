import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAllStudents } from "../Services/studentApi";

export default function StudentRegistrationGraph() {
  const [chartData, setChartData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const res = await getAllStudents();
      const students = res.data || [];

      // Group students by stream
      const streamCounts = {};
      students.forEach((student) => {
        const stream = student.stream || "Other";
        streamCounts[stream] = (streamCounts[stream] || 0) + 1;
      });

      // Convert to chart data format
      const data = Object.keys(streamCounts).map((stream) => ({
        name: stream,
        students: streamCounts[stream],
      }));

      // If we have registration dates, we can show registration over time
      // For now, we'll show by stream
      setChartData(data);
      setTotalStudents(students.length);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setChartData([]);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800">
        Student Registration by Stream
      </h2>
      <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">Total Students: <span className="font-bold text-blue-600">{totalStudents}</span></p>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#3b82f6" name="Number of Students" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No student data available
        </div>
      )}
    </div>
  );
}