import { useState, useEffect } from "react";
import axios from "axios";

export default function LogHistory() {
  const [employee, setEmployee] = useState("");
  const [employees, setEmployees] = useState([]); // all available employees
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const API = "https://d-m-server-production.up.railway.app";

  // fetch distinct employees when page loads
  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
    };
    fetchEmployees();
  }, []);

  const downloadExcel = async () => {
    try {
      const res = await axios.get(`${API}/history/export`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "history.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const fetchLogs = async (emp, p = 1) => {
    if (!emp) return;
    const res = await axios.get(`${API}/history/${emp}?page=${p}&limit=5`);
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

      {/* Employee select dropdown */}
      <select
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp} value={emp}>
            {emp}
          </option>
        ))}
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => fetchLogs(employee)}
        disabled={!employee}
      >
        Fetch Logs
      </button>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 ml-2"
        onClick={downloadExcel}
      >
        ⬇️ Download Excel
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
