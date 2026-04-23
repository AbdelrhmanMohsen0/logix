import React from 'react';
import { AuthAPI, UserAPI, OrderAPI, TokenService } from '../../services/api';

function UserListPage({ searchQuery, onNavigate }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [deleteId, setDeleteId] = React.useState(null); // for confirm dialog
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await UserAPI.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  React.useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);
  const roleLabel = (role) => (role || "").replace("ROLE_", "");
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await UserAPI.deleteUser(deleteId);
      setUsers((u) => u.filter((x) => x.id !== deleteId));
      setSuccessMsg("User deleted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            User Management
          </h2>
          <p>
            Manage team members and their roles.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate("create-user")}
            id="btn-create-user">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1rem",
              }}>
              person_add
            </span>
            Create User
          </button>
        </div>
      </div>
      {successMsg &&
        <div className="alert alert-success">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1rem",
            }}>
            check_circle
          </span>
          {successMsg}
        </div>}
      {error &&
        <div className="alert alert-error">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1rem",
            }}>
            error
          </span>
          {error}
        </div>}
      <div
        className="alert alert-info"
        style={{
          marginBottom: "1.5rem",
        }}>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "1rem",
          }}>
          info
        </span>
        User data is simulated. Backend GET/POST/PUT/DELETE /users endpoints are not yet implemented.
      </div>
      {loading
        ? <div className="loading-center">
        <div className="spinner spinner-lg" />
      </div>
        : users.length === 0
          ? <div className="empty-state">
        <span className="material-symbols-outlined">
          group_off
        </span>
        <h3>
          No users found
        </h3>
        <p>
          Create your first team member to get started.
        </p>
        <button
          className="btn btn-primary"
          style={{
            marginTop: "1rem",
          }}
          onClick={() => onNavigate("create-user")}>
          Create User
        </button>
      </div>
          : <div
        className="card"
        style={{
          padding: "0.5rem 0",
        }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Email
                </th>
                <th>
                  Role
                </th>
                <th
                  style={{
                    textAlign: "right",
                  }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && users.length > 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                    No users found for "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) =>
                  <tr key={u.id}>
                    <td className="font-medium">
                      {u.name}
                    </td>
                    <td>
                      {u.email}
                    </td>
                    <td>
                      <span className="status-badge confirmed">
                        {roleLabel(u.role)}
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                      }}>
                      <button
                        className="btn-ghost"
                        style={{
                          padding: "0.25rem",
                        }}
                        onClick={() => onNavigate("edit-user:" + u.id)}
                        title="Edit user">
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "1.125rem",
                          }}>
                          edit
                        </span>
                      </button>
                      <button
                        className="btn-ghost"
                        style={{
                          padding: "0.25rem",
                          color: "var(--error)",
                        }}
                        onClick={() => setDeleteId(u.id)}
                        title="Delete user">
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "1.125rem",
                          }}>
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>,
                )
              )}
            </tbody>
          </table>
        </div>
      </div>}
      {deleteId &&
        <div
          className="modal-overlay"
          onClick={() => !deleteLoading && setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>
              Delete User
            </h3>
            <p>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={deleteLoading}>
                {deleteLoading &&
                  <div
                    className="spinner"
                    style={{
                      borderTopColor: "#fff",
                      width: "0.875rem",
                      height: "0.875rem",
                    }} />}
                Delete
              </button>
            </div>
          </div>
        </div>}
    </div>
  );
}

export default UserListPage;
