/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: ""
  });

  const API_BASE = "http://localhost:3000/api/user";

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not load users. Check if backend is running.");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Operation failed");
        return;
      }

      setFormData({ username: "", email: "", password: "", firstname: "", lastname: "" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Submit error:", err);
      setError("Connection failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${API_BASE}/${id}`, { 
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
          fetchUsers();
        } else {
          const result = await response.json();
          setError(result.message || "Delete failed");
        }
      } catch (err) {
        console.error("Delete error:", err);
        setError("Could not connect to server to delete.");
      }
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      firstname: user.firstname || "",
      lastname: user.lastname || ""
    });
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#ffffff", color: "#000", minHeight: "100vh", width: "100vw", boxSizing: "border-box" }}>
      <h1 style={{ borderBottom: "3px solid #000" }}>User Management</h1>

      {error && (
        <div style={{ color: "white", backgroundColor: "red", padding: "15px", marginBottom: "20px", fontWeight: "bold" }}>
          ⚠️ {error}
        </div>
      )}

      {/* FORM SECTION */}
      <div style={{ backgroundColor: "#f0f0f0", padding: "20px", border: "2px solid #000", marginBottom: "20px" }}>
        <h3>{editingId ? "Edit User Mode" : "Register User Mode"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <input placeholder="Username" style={{padding: "10px", border: "1px solid #000"}} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
          <input placeholder="Email" type="email" style={{padding: "10px", border: "1px solid #000"}} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          {!editingId && (
            <input placeholder="Password" type="password" style={{padding: "10px", border: "1px solid #000"}} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          )}
          <input placeholder="First Name" style={{padding: "10px", border: "1px solid #000"}} value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} />
          <input placeholder="Last Name" style={{padding: "10px", border: "1px solid #000"}} value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} />
          
          <button type="submit" style={{ backgroundColor: "blue", color: "white", padding: "10px 20px", cursor: "pointer", fontWeight: "bold" }}>
            {editingId ? "Update User" : "Save User"}
          </button>
          {editingId && <button onClick={() => setEditingId(null)} type="button">Cancel</button>}
        </form>
      </div>

      {/* TABLE SECTION */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: "2px solid #000" }}>
        <thead>
          <tr style={{ backgroundColor: "#000", color: "#fff" }}>
            <th style={{ padding: "12px", textAlign: "left" }}>Username</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Full Name</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} style={{ borderBottom: "1px solid #000" }}>
              <td style={{ padding: "10px" }}>{user.username}</td>
              <td style={{ padding: "10px" }}>{user.email}</td>
              <td style={{ padding: "10px" }}>{user.firstname} {user.lastname}</td>
              <td style={{ padding: "10px", fontWeight: "bold", color: "green" }}>{user.status || "ACTIVE"}</td>
              <td style={{ padding: "10px" }}>
                <button onClick={() => startEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)} style={{ color: "red", marginLeft: "10px" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;