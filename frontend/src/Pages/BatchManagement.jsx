import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function BatchManagement() {
  const navigate = useNavigate();

  const batchOperations = [
    {
      title: "View Batches",
      description: "View all batches",
      icon: "📚",
      path: "/batches",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Add Batch",
      description: "Create a new batch",
      icon: "➕",
      path: "/add-batch",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Update Batch",
      description: "Update batch information",
      icon: "✏️",
      path: "/update-batch",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      title: "Delete Batch",
      description: "Remove a batch",
      icon: "🗑️",
      path: "/delete-batch",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      title: "Batch Subjects",
      description: "Manage subjects for batches",
      icon: "📖",
      path: "/batch-subjects",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Batch Students",
      description: "View students in batches",
      icon: "👥",
      path: "/batch-students",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />
      <div className="p-1.5 sm:p-3 md:p-6 ml-0 md:ml-56 mt-16 md:mt-0 pb-8 md:pb-12 box-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 md:mb-4 lg:mb-6 gap-2 sm:gap-0">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Batch Management</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded hover:bg-blue-700 text-xs sm:text-sm md:text-base"
          >
            Home
          </button>
        </div>

        <p className="text-gray-600 mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-xs sm:text-sm md:text-base">
          Manage all batch-related operations from here
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 auto-rows-fr">
          {batchOperations.map((operation, index) => (
            <div
              key={index}
              onClick={() => navigate(operation.path)}
              className={`${operation.color} text-white aspect-square w-full box-border p-1.5 sm:p-2 md:p-3 lg:p-4 xl:p-6 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl flex flex-col items-center justify-center min-w-0`}
            >
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-0.5 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 text-center">{operation.icon}</div>
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold mb-0.5 sm:mb-1 md:mb-2 text-center px-0.5 sm:px-1 leading-tight">
                {operation.title}
              </h3>
              <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-white/90 text-center px-0.5 sm:px-1 leading-tight">
                {operation.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
