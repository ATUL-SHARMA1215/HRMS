import { useState } from "react";
import api from "../api";

export default function Attendance() {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);

  // -------- Mark Attendance --------
  const markAttendance = async (status) => {
    if (!employeeId || !date) {
      alert("Enter Employee ID (e.g., EMP001) and Date");
      return;
    }

    try {
      await api.post("/attendance", {
        employee_id: employeeId.trim(),
        date: date,
        status: status.toLowerCase(),
      });

      alert(`Marked ${status} for ${employeeId}`);

      fetchAttendance(); // refresh table
    } catch (error) {
      console.error("POST attendance error:", error.response?.data || error);
      alert("Error marking attendance");
    }
  };

  // -------- View Attendance (FINAL FIX HERE) --------
  const fetchAttendance = async () => {
    if (!employeeId) {
      alert("Enter Employee ID to view attendance");
      return;
    }

    try {
      const res = await api.get(`/attendance/${employeeId.trim()}`); // ⭐ CORRECT PATH

      console.log("GET attendance response:", res.data);

      if (Array.isArray(res.data)) {
        setRecords(res.data);
      } else if (res.data.attendance) {
        setRecords(res.data.attendance);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("GET attendance error:", error.response?.data || error);
      alert("Unable to load attendance");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Attendance</h1>

      {/* Employee ID */}
      <div style={{ marginBottom: 10 }}>
        <label>Employee ID: </label>
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
          placeholder="e.g., EMP001"
        />
      </div>

      {/* Date */}
      <div style={{ marginBottom: 10 }}>
        <label>Date: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => markAttendance("Present")}
          style={{
            marginRight: 10,
            backgroundColor: "green",
            color: "white",
            padding: "6px 12px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Mark Present
        </button>

        <button
          onClick={() => markAttendance("Absent")}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "6px 12px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Mark Absent
        </button>

        <button
          onClick={fetchAttendance}
          style={{
            marginLeft: 10,
            padding: "6px 12px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          View Attendance
        </button>
      </div>

      {/* Attendance Table */}
      {records.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr key={index}>
                <td>{rec.employee_id}</td>
                <td>{rec.date}</td>
                <td>{rec.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}