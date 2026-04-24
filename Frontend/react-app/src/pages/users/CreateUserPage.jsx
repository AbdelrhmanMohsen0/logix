import React from 'react';
import { AuthAPI, UserAPI, OrderAPI, TokenService } from '../../services/api';

function CreateUserPage({ onNavigate }) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    role: "ROLE_WORKER",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };
  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    return "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await UserAPI.createUser(form);
      onNavigate("users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const roles = [
    "ROLE_ADMIN",
    "ROLE_MANAGER",
    "ROLE_SALES",
    "ROLE_WORKER",
  ];
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Create User
          </h2>
          <p>
            Add a new team member to your organization.
          </p>
        </div>
      </div>
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
        Mock mode — POST /users endpoint is not yet implemented in the backend.
      </div>
      <div
        className="card"
        style={{
          maxWidth: "560px",
          padding: "2rem",
        }}>
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
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cu-name">
              Name
            </label>
            <input
              id="cu-name"
              className="form-input"
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="cu-email">
              Email
            </label>
            <input
              id="cu-email"
              className="form-input"
              type="email"
              name="email"
              placeholder="user@company.com"
              value={form.email}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="cu-role">
              Role
            </label>
            <select
              id="cu-role"
              className="form-input"
              name="role"
              value={form.role}
              onChange={handleChange}>
              {roles.map((r) =>
                <option key={r} value={r}>
                  {r.replace("ROLE_", "")}
                </option>,
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cu-password">
              Password
            </label>
            <input
              id="cu-password"
              className="form-input"
              type="password"
              name="password"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password" />
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.5rem",
            }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="cu-submit">
              {loading &&
                <div
                  className="spinner"
                  style={{
                    borderTopColor: "#fff",
                  }} />}
              {loading ? "Creating…" : "Create User"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate("users")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;
