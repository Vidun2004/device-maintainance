import { useState } from "react";
import axios from "axios";

export default function ScheduleForm({ onAdded }) {
  const [employee, setEmployee] = useState("");
  const [device, setDevice] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employee || !device || !day || !time) return alert("Fill all fields!");

    await axios.post("http://localhost:5000/schedule", {
      employee,
      device,
      day,
      time: `${time}:00`,
    });

    setEmployee("");
    setDevice("");
    setDay("");
    setTime("");
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <input
        type="text"
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
        placeholder="Employee Name"
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        value={device}
        onChange={(e) => setDevice(e.target.value)}
        placeholder="Device (Laptop, Phone...)"
        className="border p-2 rounded w-full"
      />
      <select
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Day</option>
        {Array.from({ length: 31 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Time</option>
        {[10, 11, 12, 13, 14, 15].map((hour) => (
          <option key={hour} value={hour}>
            {hour}:00
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Schedule
      </button>
    </form>
  );
}
