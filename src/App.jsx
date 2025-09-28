import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import LogHistory from "./pages/LogHistory";
import ScheduleManager from "./pages/ScheduleManager"; // <-- create this page

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white shadow flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            page === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white"
          }`}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded ${
            page === "logs"
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white"
          }`}
          onClick={() => setPage("logs")}
        >
          Log History
        </button>
        <button
          className={`px-4 py-2 rounded ${
            page === "manage"
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white"
          }`}
          onClick={() => setPage("manage")}
        >
          User Manager
        </button>
      </div>

      <div className="p-6">
        {page === "dashboard" && <Dashboard />}
        {page === "logs" && <LogHistory />}
        {page === "manage" && <ScheduleManager />}
      </div>
    </div>
  );
}
