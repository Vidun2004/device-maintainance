export default function LogsTable({ employee, expandedLogs, onPageChange }) {
  const logs = expandedLogs.logs || [];
  const page = expandedLogs.page;
  const pages = expandedLogs.pages;

  return (
    <div className="mt-2 border-t pt-2">
      <table className="w-full text-left border-collapse">
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
            onClick={() => onPageChange(employee, page - 1)}
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
            onClick={() => onPageChange(employee, page + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
