import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "https://timesheet-management-system-1m1z.onrender.com";

function App() {
  const [page, setPage] = useState("login");

  if (page === "register") return <Register setPage={setPage} />;
  if (page === "employee") return <EmployeeDashboard setPage={setPage} />;
  if (page === "manager") return <ManagerDashboard setPage={setPage} />;

  return <Login setPage={setPage} />;
}

// ---------------- LOGIN ----------------
function Login({ setPage }) {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/login`, { name, password, role });
      localStorage.setItem("name", name);
      localStorage.setItem("employeeId", res.data.userId);
      setPage(res.data.role);
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="">Role</option>
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
      </select>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <p onClick={() => setPage("register")} className="link">Register</p>
    </div>
  );
}

// ---------------- REGISTER ----------------
function Register({ setPage }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await axios.post(`${API}/api/register`, { name, password, managerId: "ADMIN01" });
    setPage("login");
  };

  return (
    <div className="container">
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
    </div>
  );
}

// ---------------- EMPLOYEE ----------------
function EmployeeDashboard({ setPage }) {
  const employeeId = localStorage.getItem("employeeId");
  const today = new Date().toDateString();

  const [work, setWork] = useState("");
  const [hours, setHours] = useState("");
  const [sheet, setSheet] = useState(null);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const sheetRes = await axios.get(`${API}/api/timesheet/my/${employeeId}?date=${today}`);
      const totalRes = await axios.get(`${API}/api/timesheet/total/${employeeId}`);

      setSheet(sheetRes.data);
      setTotalHours(totalRes.data.totalHours);

      if (sheetRes.data) {
        setWork(sheetRes.data.work);
        setHours(sheetRes.data.hours);
      }
    };
    fetchData();
  }, [employeeId, today]);

  const submit = async () => {
    try {
      await axios.post(`${API}/api/timesheet/submit`, {
        employeeId,
        employeeName: localStorage.getItem("name"),
        date: today,
        work,
        hours
      });
      alert("Timesheet saved successfully");
      window.location.reload();
    } catch {
      alert("Save failed");
    }
  };

  return (
    <div className="container">
      <h2>Employee Dashboard</h2>

      <p><b>Total Hours Worked:</b> {totalHours} hrs</p>

      <textarea value={work} disabled={sheet?.locked} onChange={(e) => setWork(e.target.value)} />
      <input type="number" placeholder="Hours Worked"
        value={hours}
        disabled={sheet?.locked}
        onChange={(e) => setHours(e.target.value)}
      />

      <button onClick={submit} disabled={sheet?.locked}>Submit</button>

      {sheet?.rating && <p>Rating: {sheet.rating}</p>}

      <button onClick={() => setPage("login")}>Logout</button>
    </div>
  );
}

// ---------------- MANAGER ----------------
function ManagerDashboard({ setPage }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/timesheet/all`).then(res => setData(res.data));
  }, []);

  const rate = async (id, rating) => {
    await axios.post(`${API}/api/timesheet/rate`, { id, rating });
    const res = await axios.get(`${API}/api/timesheet/all`);
    setData(res.data);
  };

  return (
    <div className="container">
      <h2>Manager Dashboard</h2>

      {data.map(t => (
        <div key={t._id} className="card">
          <p><b>{t.employeeName}</b></p>
          <p>{t.work}</p>
          <p>Hours: {t.hours}</p>
          <p>Rating: {t.rating || "Not rated"}</p>

          {!t.locked && [1, 2, 3, 4, 5].map(r => (
            <button key={r} onClick={() => rate(t._id, r)}>{r}</button>
          ))}
        </div>
      ))}

      <button onClick={() => setPage("login")}>Logout</button>
    </div>
  );
}

export default App;
