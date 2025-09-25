import { useState, useEffect } from "react";
import axios from "axios";
import ScheduleForm from "../components/ScheduleForm";
import UpcomingSchedules from "../components/UpcomingSchedules";

export default function Dashboard() {
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    const res = await axios.get("http://localhost:5000/schedule");
    const sorted = [...res.data].sort(
      (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
    );
    setSchedules(sorted);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">🛠 Dashboard</h1>
      <ScheduleForm onAdded={fetchSchedules} />
      <h2 className="text-xl font-semibold mb-2">
        📅 Upcoming Schedules This Week
      </h2>
      <UpcomingSchedules
        schedules={schedules}
        refreshSchedules={fetchSchedules}
      />
    </div>
  );
}
