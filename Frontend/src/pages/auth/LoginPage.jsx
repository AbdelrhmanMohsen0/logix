import React from 'react';
import { useAuth } from '../../context/AuthContext';

function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [form, setForm] = React.useState({
    email: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const u = await login(form.email, form.password);
      const role = (u?.role || '').replace('ROLE_', '');
      let defaultPage = 'dashboard';
      if (role === 'SALES') defaultPage = 'orders';
      if (role === 'WORKER') defaultPage = 'warehouse-operations';
      onNavigate(defaultPage);
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
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
          Sign in to your account
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
            <label htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              name="password"
              placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password" />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            id="login-submit"
            style={{
              marginTop: "0.5rem",
            }}>
            {loading &&
              <div
                className="spinner"
                style={{
                  borderTopColor: "#fff",
                }} />}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.875rem",
            color: "var(--on-surface-variant)",
          }}>
          Don't have an account?
          {" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("signup");
            }}
            id="goto-signup">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
