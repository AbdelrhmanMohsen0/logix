import React from 'react';
import { useAuth } from '../../context/AuthContext';

function SignupPage({ onNavigate }) {
  const { signup } = useAuth();
  const [form, setForm] = React.useState({
    organizationName: "",
    email: "",
    adminName: "",
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
    if (!form.organizationName.trim()) return "Organization name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.adminName.trim()) return "Owner name is required.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    if (form.password.length > 30)
      return "Password must be at most 30 characters.";
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
      await signup(form);
      onNavigate("login");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo">
          LogiX
        </div>
        <div className="subtitle">
          Kinetic Architect
        </div>
        <h2>
          Create your organization
        </h2>
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
            <label htmlFor="signup-org">
              Organization Name
            </label>
            <input
              id="signup-org"
              className="form-input"
              type="text"
              name="organizationName"
              placeholder="Acme Corp"
              value={form.organizationName}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              className="form-input"
              type="email"
              name="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="signup-name">
              Owner Name
            </label>
            <input
              id="signup-name"
              className="form-input"
              type="text"
              name="adminName"
              placeholder="Alex Carter"
              value={form.adminName}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              className="form-input"
              type="password"
              name="password"
              placeholder={"8\u201330 characters"}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password" />
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--outline)",
                marginTop: "0.25rem",
              }}>
              Must be between 8 and 30 characters.
            </p>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            id="signup-submit"
            style={{
              marginTop: "0.5rem",
            }}>
            {loading &&
              <div
                className="spinner"
                style={{
                  borderTopColor: "#fff",
                }} />}
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.875rem",
            color: "var(--on-surface-variant)",
          }}>
          Already have an account?
          {" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("login");
            }}
            id="goto-login">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
