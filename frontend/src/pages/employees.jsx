import { useEffect, useState } from "react";
import axios from "axios";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    email: "",
    department: ""
  });

  const [deleteId, setDeleteId] = useState("");

  const API = "http://127.0.0.1:8000";

  const loadEmployees = async () => {
    const res = await axios.get(`${API}/employees`);
    setEmployees(res.data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const addEmployee = async () => {
    await axios.post(`${API}/employees`, form);
    setForm({ employee_id: "", name: "", email: "", department: "" });
    loadEmployees();
  };

  const deleteEmployee = async () => {
    if (!deleteId) {
      alert("Please enter Employee ID");
      return;
    }

    try {
      await axios.delete(`${API}/employees/${deleteId}`);
      alert(`Employee ${deleteId} deleted successfully`);
      setDeleteId("");
      loadEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Employee Management</h2>

      {/* -------- Add Employee -------- */}
      <div className="card p-3 mb-4 shadow">
        <h5>Add Employee</h5>
        <div className="row g-2">
          {Object.keys(form).map((key) => (
            <div className="col-md-3" key={key}>
              <input
                className="form-control"
                placeholder={key}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-3" onClick={addEmployee}>
          Add Employee
        </button>
      </div>

      {/* -------- Delete Employee -------- */}
      <div className="card p-3 mb-4 shadow">
        <h5>Delete Employee</h5>
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Employee ID (e.g. EMP001)"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value.toUpperCase())}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-danger w-100"
              onClick={deleteEmployee}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* -------- Employee List -------- */}
      <div className="card p-3 shadow">
        <h5>Employee List</h5>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employee_id}>
                <td>{emp.employee_id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
