import React from 'react';
import { AuthAPI, UserAPI, OrderAPI, TokenService } from '../../services/api';

function EditUserPage({ userId, onNavigate }) {
  const [form, setForm] = React.useState({
    name: "",
    role: "",
  });
  const [original, setOriginal] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const user = await UserAPI.getUser(userId);
        if (!cancelled) {
          setOriginal(user);
          setForm({
            name: user.name,
            role: user.role,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);
  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await UserAPI.updateUser(userId, form);
      onNavigate("users");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const roles = [
    "ROLE_ADMIN",
    "ROLE_MANAGER",
    "ROLE_SALES",
    "ROLE_WORKER",
  ];
  const isOwner = original?.role === "ROLE_OWNER";
  const selectableRoles = isOwner ? ["ROLE_OWNER", ...roles] : roles;
  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner spinner-lg" />
      </div>
    );
  }
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Edit User
          </h2>
          <p>
            {"Update user information for "}
            {original?.name || "this user"}
            .
          </p>
        </div>
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
            <label htmlFor="eu-name">
              Name
            </label>
            <input
              id="eu-name"
              className="form-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="eu-email">
              Email
            </label>
            <input
              id="eu-email"
              className="form-input"
              type="email"
              value={original?.email || ""}
              disabled={true}
              style={{
                opacity: 0.6,
              }} />
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--outline)",
                marginTop: "0.25rem",
              }}>
              Email cannot be changed.
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="eu-role">
              Role
            </label>
            <select
              id="eu-role"
              className="form-input"
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={isOwner}
              style={isOwner ? { opacity: 0.6, cursor: "not-allowed" } : {}}>
              {selectableRoles.map((r) =>
                <option key={r} value={r}>
                  {r.replace("ROLE_", "")}
                </option>,
              )}
            </select>
            {isOwner &&
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--outline)",
                  marginTop: "0.25rem",
                }}>
                Owner role cannot be changed.
              </p>}
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
              disabled={saving}
              id="eu-submit">
              {saving &&
                <div
                  className="spinner"
                  style={{
                    borderTopColor: "#fff",
                  }} />}
              {saving ? "Saving…" : "Save Changes"}
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

export default EditUserPage;
