import { useState } from "react";
import axios from "axios";
import LogsTable from "./LogsTable";

export default function UpcomingSchedules({ schedules, refreshSchedules }) {
  const [expandedLogs, setExpandedLogs] = useState({});

  const todayStr = new Date().toDateString();

  // Start of week (Monday) and next 7 days
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  const toggleLogs = async (employee) => {
    if (expandedLogs[employee]) {
      setExpandedLogs((prev) => ({ ...prev, [employee]: null }));
      return;
    }
    const page = 1;
    const res = await axios.get(
      `http://localhost:5000/history/${employee}?page=${page}&limit=5`
    );
    setExpandedLogs((prev) => ({ ...prev, [employee]: { ...res.data } }));
  };

  const changePage = async (employee, newPage) => {
    const res = await axios.get(
      `http://localhost:5000/history/${employee}?page=${newPage}&limit=5`
    );
    setExpandedLogs((prev) => ({ ...prev, [employee]: { ...res.data } }));
  };

  const markCleaned = async (id) => {
    await axios.post(`http://localhost:5000/schedule/${id}/cleaned`);
    refreshSchedules();
  };

  // Filter schedules for this week
  const weeklySchedules = schedules.filter((s) => {
    const date = new Date(s.dateTime);
    return date >= weekDays[0] && date <= weekDays[6];
  });

  // Group by day
  const schedulesByDay = {};
  weekDays.forEach((day) => {
    schedulesByDay[day.toDateString()] = weeklySchedules.filter(
      (s) => new Date(s.dateTime).toDateString() === day.toDateString()
    );
  });

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day.toDateString()}
            className={`p-2 rounded shadow ${
              day.toDateString() === todayStr ? "bg-yellow-100" : "bg-white"
            }`}
          >
            <div className="font-bold mb-2 text-center">
              {day.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
              })}
            </div>
            {schedulesByDay[day.toDateString()].map((s) => (
              <div
                key={s.id}
                className={`border p-2 rounded mb-2 text-sm flex flex-col space-y-1 ${
                  s.cleaned ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div>
                  <b>{s.employee}</b> - {s.device} @ {s.time}
                </div>
                <div className="flex space-x-1">
                  <button
                    className="bg-green-500 text-white px-1 py-0.5 rounded text-xs"
                    onClick={() => markCleaned(s.id)}
                  >
                    ✅
                  </button>
                  <button
                    className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs"
                    onClick={() => toggleLogs(s.employee)}
                  >
                    📜
                  </button>
                </div>
                {expandedLogs[s.employee] && (
                  <LogsTable
                    employee={s.employee}
                    expandedLogs={expandedLogs[s.employee]}
                    onPageChange={changePage}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
