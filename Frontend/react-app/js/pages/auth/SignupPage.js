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
    if (!form.adminName.trim()) return "Admin name is required.";
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
      onNavigate("dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
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
      React.createElement("h2", null, "Create your organization"),
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
              htmlFor: "signup-org",
            },
            "Organization Name",
          ),
          React.createElement("input", {
            id: "signup-org",
            className: "form-input",
            type: "text",
            name: "organizationName",
            placeholder: "Acme Corp",
            value: form.organizationName,
            onChange: handleChange,
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
              htmlFor: "signup-email",
            },
            "Email",
          ),
          React.createElement("input", {
            id: "signup-email",
            className: "form-input",
            type: "email",
            name: "email",
            placeholder: "admin@company.com",
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
              htmlFor: "signup-name",
            },
            "Admin Name",
          ),
          React.createElement("input", {
            id: "signup-name",
            className: "form-input",
            type: "text",
            name: "adminName",
            placeholder: "Alex Carter",
            value: form.adminName,
            onChange: handleChange,
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
              htmlFor: "signup-password",
            },
            "Password",
          ),
          React.createElement("input", {
            id: "signup-password",
            className: "form-input",
            type: "password",
            name: "password",
            placeholder: "8\u201330 characters",
            value: form.password,
            onChange: handleChange,
            autoComplete: "new-password",
          }),
          React.createElement(
            "p",
            {
              style: {
                fontSize: "0.75rem",
                color: "var(--outline)",
                marginTop: "0.25rem",
              },
            },
            "Must be between 8 and 30 characters.",
          ),
        ),
        React.createElement(
          "button",
          {
            type: "submit",
            className: "btn btn-primary btn-block",
            disabled: loading,
            id: "signup-submit",
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
          loading ? "Creating account…" : "Create Account",
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
        "Already have an account?",
        " ",
        React.createElement(
          "a",
          {
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              onNavigate("login");
            },
            id: "goto-login",
          },
          "Sign in",
        ),
      ),
    ),
  );
}
