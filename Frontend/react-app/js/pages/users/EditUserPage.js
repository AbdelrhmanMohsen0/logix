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
    "ROLE_OWNER",
    "ROLE_ADMIN",
    "ROLE_MANAGER",
    "ROLE_SALES",
    "ROLE_WORKER",
  ];
  if (loading) {
    return React.createElement(
      "div",
      {
        className: "loading-center",
      },
      React.createElement("div", {
        className: "spinner spinner-lg",
      }),
    );
  }
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
        React.createElement("h2", null, "Edit User"),
        React.createElement(
          "p",
          null,
          "Update user information for ",
          original?.name || "this user",
          ".",
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
      "Mock mode \u2014 PUT /users/",
      "{id}",
      " endpoint is not yet implemented in the backend.",
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
              htmlFor: "eu-name",
            },
            "Name",
          ),
          React.createElement("input", {
            id: "eu-name",
            className: "form-input",
            type: "text",
            name: "name",
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
              htmlFor: "eu-email",
            },
            "Email",
          ),
          React.createElement("input", {
            id: "eu-email",
            className: "form-input",
            type: "email",
            value: original?.email || "",
            disabled: true,
            style: {
              opacity: 0.6,
            },
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
            "Email cannot be changed.",
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
              htmlFor: "eu-role",
            },
            "Role",
          ),
          React.createElement(
            "select",
            {
              id: "eu-role",
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
              disabled: saving,
              id: "eu-submit",
            },
            saving &&
              React.createElement("div", {
                className: "spinner",
                style: {
                  borderTopColor: "#fff",
                },
              }),
            saving ? "Saving…" : "Save Changes",
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
