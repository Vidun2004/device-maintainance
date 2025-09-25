import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import LogHistory from "./pages/LogHistory";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white shadow flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPage("logs")}
        >
          Log History
        </button>
      </div>
      {page === "dashboard" ? <Dashboard /> : <LogHistory />}
    </div>
  );
}
