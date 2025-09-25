import { useState } from "react";
import axios from "axios";

export default function LogHistory() {
  const [employee, setEmployee] = useState("");
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchLogs = async (emp, p = 1) => {
    if (!emp) return;
    const res = await axios.get(
      `https://d-m-server-production.up.railway.app/history/${emp}?page=${p}&limit=5`
    );
    setLogs(res.data.logs);
    setPage(res.data.page);
    setPages(res.data.pages);
  };

  const handlePageChange = (newPage) => {
    fetchLogs(employee, newPage);
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">📜 Log History</h1>
      <input
        type="text"
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
        placeholder="Enter Employee Name"
        className="border p-2 rounded w-full mb-4"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => fetchLogs(employee)}
      >
        Fetch Logs
      </button>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">Device</th>
            <th className="border px-2 py-1">Cleaned At</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td className="border px-2 py-1">{log.device}</td>
              <td className="border px-2 py-1">
                {new Date(log.cleanedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 space-x-2">
        {page > 1 && (
          <button
            className="px-2 py-1 border rounded"
            onClick={() => handlePageChange(page - 1)}
          >
            Prev
          </button>
        )}
        <span>
          Page {page} / {pages}
        </span>
        {page < pages && (
          <button
            className="px-2 py-1 border rounded"
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
