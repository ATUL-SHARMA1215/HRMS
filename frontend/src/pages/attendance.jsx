import { useState } from "react";
import api from "../api";

export default function Attendance() {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // -------- Mark Attendance --------
  const markAttendance = async (status) => {
    if (!employeeId || !date) {
      alert("Enter Employee ID (e.g., EMP001) and Date");
      return;
    }

    try {
      setLoading(true);

      await api.post("/attendance", {
        employee_id: employeeId.trim(),
        date: date,
        status: status.toLowerCase(),
      });

      alert(`Marked ${status} for ${employeeId}`);

      await fetchAttendance(); // refresh table after marking
    } catch (error) {
      console.error("POST attendance error:", error.response?.data || error);
      alert(
        error.response?.data?.detail ||
          "Error marking attendance. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // -------- View Attendance --------
  const fetchAttendance = async () => {
    if (!employeeId) {
      alert("Enter Employee ID to view attendance");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(`/attendance/${employeeId.trim()}`);

      console.log("GET attendance response:", res.data);

      // Ensure records always array
      if (Array.isArray(res.data)) {
        setRecords(res.data);
      } else if (Array.isArray(res.data.attendance)) {
        setRecords(res.data.attendance);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("GET attendance error:", error.response?.data || error);
      alert(
        error.response?.data?.detail ||
          "Unable to load attendance. Check backend URL or CORS."
      );
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 700 }}>
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* No records */}
      {!loading && records.length === 0 && (
        <p>No attendance records found.</p>
      )}

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