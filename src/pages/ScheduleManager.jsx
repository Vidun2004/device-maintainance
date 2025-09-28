import { useState, useEffect } from "react";
import axios from "axios";

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    employee: "",
    device: "",
    day: "",
    time: "",
  });

  const API = "https://d-m-server-production.up.railway.app/schedule";

  const fetchSchedules = async () => {
    const res = await axios.get(API);
    setSchedules(res.data);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({
      employee: s.employee,
      device: s.device,
      day: s.day,
      time: s.time.split(":")[0],
    });
  };

  const saveEdit = async () => {
    await axios.put(`${API}/${editingId}`, {
      ...form,
      time: `${form.time}:00`,
    });
    setEditingId(null);
    fetchSchedules();
  };

  const deleteSchedule = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`${API}/${id}`);
    fetchSchedules();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Schedule Manager</h2>
      <table className="border w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Employee</th>
            <th className="border p-2">Device</th>
            <th className="border p-2">Day</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">
                {editingId === s.id ? (
                  <input
                    className="border p-1"
                    value={form.employee}
                    onChange={(e) =>
                      setForm({ ...form, employee: e.target.value })
                    }
                  />
                ) : (
                  s.employee
                )}
              </td>
              <td className="border p-2">
                {editingId === s.id ? (
                  <input
                    className="border p-1"
                    value={form.device}
                    onChange={(e) =>
                      setForm({ ...form, device: e.target.value })
                    }
                  />
                ) : (
                  s.device
                )}
              </td>
              <td className="border p-2">
                {editingId === s.id ? (
                  <input
                    type="number"
                    className="border p-1 w-16"
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                  />
                ) : (
                  s.day
                )}
              </td>
              <td className="border p-2">
                {editingId === s.id ? (
                  <select
                    className="border p-1"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  >
                    {[10, 11, 12, 13, 14, 15].map((h) => (
                      <option key={h} value={h}>
                        {h}:00
                      </option>
                    ))}
                  </select>
                ) : (
                  s.time
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editingId === s.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(s)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSchedule(s.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
