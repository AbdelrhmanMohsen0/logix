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
      await login(form.email, form.password);
      onNavigate("dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  return React.createElement(
    "div",
    {
      className: "auth-wrapper",
    },
    React.createElement(
      "div",
      {
        className: "auth-card",
      },
      React.createElement(
        "div",
        {
          className: "logo",
        },
        "LogiX",
      ),
      React.createElement(
        "div",
        {
          className: "subtitle",
        },
        "Kinetic Architect",
      ),
      React.createElement("h2", null, "Sign in to your account"),
      error &&
        React.createElement(
          "div",
          {
            className: "alert alert-error",
          },
          React.createElement(
            "span",
            {
              className: "material-symbols-outlined",
              style: {
                fontSize: "1rem",
              },
            },
            "error",
          ),
          error,
        ),
      React.createElement(
        "form",
        {
          onSubmit: handleSubmit,
        },
        React.createElement(
          "div",
          {
            className: "form-group",
          },
          React.createElement(
            "label",
            {
              htmlFor: "login-email",
            },
            "Email",
          ),
          React.createElement("input", {
            id: "login-email",
            className: "form-input",
            type: "email",
            name: "email",
            placeholder: "you@company.com",
            value: form.email,
            onChange: handleChange,
            autoComplete: "email",
          }),
        ),
        React.createElement(
          "div",
          {
            className: "form-group",
          },
          React.createElement(
            "label",
            {
              htmlFor: "login-password",
            },
            "Password",
          ),
          React.createElement("input", {
            id: "login-password",
            className: "form-input",
            type: "password",
            name: "password",
            placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
            value: form.password,
            onChange: handleChange,
            autoComplete: "current-password",
          }),
        ),
        React.createElement(
          "button",
          {
            type: "submit",
            className: "btn btn-primary btn-block",
            disabled: loading,
            id: "login-submit",
            style: {
              marginTop: "0.5rem",
            },
          },
          loading &&
            React.createElement("div", {
              className: "spinner",
              style: {
                borderTopColor: "#fff",
              },
            }),
          loading ? "Signing in…" : "Sign In",
        ),
      ),
      React.createElement(
        "p",
        {
          style: {
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.875rem",
            color: "var(--on-surface-variant)",
          },
        },
        "Don't have an account?",
        " ",
        React.createElement(
          "a",
          {
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              onNavigate("signup");
            },
            id: "goto-signup",
          },
          "Create one",
        ),
      ),
    ),
  );
}
