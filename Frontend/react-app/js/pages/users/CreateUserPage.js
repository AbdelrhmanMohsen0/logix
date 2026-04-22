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
    "ROLE_OWNER",
    "ROLE_ADMIN",
    "ROLE_MANAGER",
    "ROLE_SALES",
    "ROLE_WORKER",
  ];
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      {
        className: "page-header",
      },
      React.createElement(
        "div",
        null,
        React.createElement("h2", null, "Create User"),
        React.createElement(
          "p",
          null,
          "Add a new team member to your organization.",
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "alert alert-info",
        style: {
          marginBottom: "1.5rem",
        },
      },
      React.createElement(
        "span",
        {
          className: "material-symbols-outlined",
          style: {
            fontSize: "1rem",
          },
        },
        "info",
      ),
      "Mock mode \u2014 POST /users endpoint is not yet implemented in the backend.",
    ),
    React.createElement(
      "div",
      {
        className: "card",
        style: {
          maxWidth: "560px",
          padding: "2rem",
        },
      },
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
              htmlFor: "cu-name",
            },
            "Name",
          ),
          React.createElement("input", {
            id: "cu-name",
            className: "form-input",
            type: "text",
            name: "name",
            placeholder: "Full name",
            value: form.name,
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
              htmlFor: "cu-email",
            },
            "Email",
          ),
          React.createElement("input", {
            id: "cu-email",
            className: "form-input",
            type: "email",
            name: "email",
            placeholder: "user@company.com",
            value: form.email,
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
              htmlFor: "cu-role",
            },
            "Role",
          ),
          React.createElement(
            "select",
            {
              id: "cu-role",
              className: "form-input",
              name: "role",
              value: form.role,
              onChange: handleChange,
            },
            roles.map((r) =>
              React.createElement(
                "option",
                {
                  key: r,
                  value: r,
                },
                r.replace("ROLE_", ""),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "form-group",
          },
          React.createElement(
            "label",
            {
              htmlFor: "cu-password",
            },
            "Password",
          ),
          React.createElement("input", {
            id: "cu-password",
            className: "form-input",
            type: "password",
            name: "password",
            placeholder: "Min 8 characters",
            value: form.password,
            onChange: handleChange,
            autoComplete: "new-password",
          }),
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.5rem",
            },
          },
          React.createElement(
            "button",
            {
              type: "submit",
              className: "btn btn-primary",
              disabled: loading,
              id: "cu-submit",
            },
            loading &&
              React.createElement("div", {
                className: "spinner",
                style: {
                  borderTopColor: "#fff",
                },
              }),
            loading ? "Creating…" : "Create User",
          ),
          React.createElement(
            "button",
            {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => onNavigate("users"),
            },
            "Cancel",
          ),
        ),
      ),
    ),
  );
}
