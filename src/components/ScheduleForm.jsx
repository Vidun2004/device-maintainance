import { useState, useEffect } from "react";
import axios from "axios";

export default function ScheduleForm({ onAdded }) {
  const [employee, setEmployee] = useState("");
  const [device, setDevice] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [taken, setTaken] = useState([]); // store taken slots like "10-11:00"

  useEffect(() => {
    const fetchSchedules = async () => {
      const res = await axios.get(
        "https://d-m-server-production.up.railway.app/schedule"
      );
      const booked = res.data.map((s) => `${s.day}-${s.time}`);
      setTaken(booked);
    };
    fetchSchedules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employee || !device || !day || !time) return alert("Fill all fields!");

    if (taken.includes(`${day}-${time}:00`)) {
      return alert("That slot is already taken!");
    }

    await axios.post("https://d-m-server-production.up.railway.app/schedule", {
      employee,
      device,
      day,
      time: `${time}:00`,
    });

    setEmployee("");
    setDevice("");
    setDay("");
    setTime("");

    // refresh taken slots
    const res = await axios.get(
      "https://d-m-server-production.up.railway.app/schedule"
    );
    const booked = res.data.map((s) => `${s.day}-${s.time}`);
    setTaken(booked);

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

      {/* Day dropdown */}
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

      {/* Time dropdown (only disable taken slots for selected day) */}
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border p-2 rounded w-full"
        disabled={!day} // only enable if day chosen
      >
        <option value="">Select Time</option>
        {[10, 11, 12, 13, 14, 15].map((hour) => {
          const slot = `${day}-${hour}:00`; // e.g. "10-11:00"
          return (
            <option key={hour} value={hour} disabled={taken.includes(slot)}>
              {hour}:00
            </option>
          );
        })}
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
