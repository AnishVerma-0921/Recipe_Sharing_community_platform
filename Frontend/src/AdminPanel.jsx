import { useState } from "react";
import { loadUsers, deleteUser } from "./auth/credentials.js";

export default function AdminPanel({ onLogout }) {
  const [users, setUsers] = useState(() => loadUsers());

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      setUsers(loadUsers());
    }
  }

  return (
    <main className="admin-page-container">
      <div className="admin-panel-card">
        <div className="admin-header">
          <div>
            <div className="admin-title-row">
              <h2>Admin Control Center</h2>
              <span className="cloth-tag cloth-tag-admin">
                <span className="cloth-tag-stitch"></span>
                ADMIN CONSOLE
              </span>
            </div>
            <p className="admin-subtitle">Manage registered users, inspect credentials, and control access permissions.</p>
          </div>
          <button className="button button-outline" onClick={onLogout}>Logout</button>
        </div>

        <div className="admin-stats-bar">
          <div className="admin-stat-box">
            <span className="admin-stat-num">{users.length}</span>
            <span className="admin-stat-label">Total Users</span>
          </div>
          <div className="admin-stat-box">
            <span className="admin-stat-num">{users.filter(u => u.role === "admin").length}</span>
            <span className="admin-stat-label">Admins</span>
          </div>
          <div className="admin-stat-box">
            <span className="admin-stat-num">{users.filter(u => u.role !== "admin").length}</span>
            <span className="admin-stat-label">Standard Users</span>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>User / ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role Tag</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={u.role === "admin" ? "admin-user-row" : ""}>
                  <td className="user-id-cell">
                    <code>{u.id}</code>
                  </td>
                  <td className="user-name-cell">
                    <strong>{u.name}</strong>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`cloth-tag cloth-tag-${u.role === "admin" ? "admin" : "user"}`}>
                      <span className="cloth-tag-stitch"></span>
                      {u.role ? u.role.toUpperCase() : "USER"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {u.role === "admin" ? (
                      <span className="protected-badge">Protected</span>
                    ) : (
                      <button className="button button-red-delete" onClick={() => handleDelete(u.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
