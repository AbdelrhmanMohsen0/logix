function UserListPage({ onNavigate }) {
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
        React.createElement("h2", null, "User Management"),
        React.createElement("p", null, "Manage team members and their roles."),
      ),
      React.createElement(
        "div",
        {
          className: "page-actions",
        },
        React.createElement(
          "button",
          {
            className: "btn btn-primary btn-sm",
            onClick: () => onNavigate("create-user"),
            id: "btn-create-user",
          },
          React.createElement(
            "span",
            {
              className: "material-symbols-outlined",
              style: {
                fontSize: "1rem",
              },
            },
            "person_add",
          ),
          "Create User",
        ),
      ),
    ),
    successMsg &&
      React.createElement(
        "div",
        {
          className: "alert alert-success",
        },
        React.createElement(
          "span",
          {
            className: "material-symbols-outlined",
            style: {
              fontSize: "1rem",
            },
          },
          "check_circle",
        ),
        successMsg,
      ),
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
      "User data is simulated. Backend GET/POST/PUT/DELETE /users endpoints are not yet implemented.",
    ),
    loading
      ? React.createElement(
          "div",
          {
            className: "loading-center",
          },
          React.createElement("div", {
            className: "spinner spinner-lg",
          }),
        )
      : users.length === 0
        ? React.createElement(
            "div",
            {
              className: "empty-state",
            },
            React.createElement(
              "span",
              {
                className: "material-symbols-outlined",
              },
              "group_off",
            ),
            React.createElement("h3", null, "No users found"),
            React.createElement(
              "p",
              null,
              "Create your first team member to get started.",
            ),
            React.createElement(
              "button",
              {
                className: "btn btn-primary",
                style: {
                  marginTop: "1rem",
                },
                onClick: () => onNavigate("create-user"),
              },
              "Create User",
            ),
          )
        : React.createElement(
            "div",
            {
              className: "card",
              style: {
                padding: "0.5rem 0",
              },
            },
            React.createElement(
              "div",
              {
                className: "table-wrapper",
              },
              React.createElement(
                "table",
                null,
                React.createElement(
                  "thead",
                  null,
                  React.createElement(
                    "tr",
                    null,
                    React.createElement("th", null, "Name"),
                    React.createElement("th", null, "Email"),
                    React.createElement("th", null, "Role"),
                    React.createElement(
                      "th",
                      {
                        style: {
                          textAlign: "right",
                        },
                      },
                      "Actions",
                    ),
                  ),
                ),
                React.createElement(
                  "tbody",
                  null,
                  users.map((u) =>
                    React.createElement(
                      "tr",
                      {
                        key: u.id,
                      },
                      React.createElement(
                        "td",
                        {
                          className: "font-medium",
                        },
                        u.name,
                      ),
                      React.createElement("td", null, u.email),
                      React.createElement(
                        "td",
                        null,
                        React.createElement(
                          "span",
                          {
                            className: "status-badge confirmed",
                          },
                          roleLabel(u.role),
                        ),
                      ),
                      React.createElement(
                        "td",
                        {
                          style: {
                            textAlign: "right",
                          },
                        },
                        React.createElement(
                          "button",
                          {
                            className: "btn-ghost",
                            style: {
                              padding: "0.25rem",
                            },
                            onClick: () => onNavigate("edit-user:" + u.id),
                            title: "Edit user",
                          },
                          React.createElement(
                            "span",
                            {
                              className: "material-symbols-outlined",
                              style: {
                                fontSize: "1.125rem",
                              },
                            },
                            "edit",
                          ),
                        ),
                        React.createElement(
                          "button",
                          {
                            className: "btn-ghost",
                            style: {
                              padding: "0.25rem",
                              color: "var(--error)",
                            },
                            onClick: () => setDeleteId(u.id),
                            title: "Delete user",
                          },
                          React.createElement(
                            "span",
                            {
                              className: "material-symbols-outlined",
                              style: {
                                fontSize: "1.125rem",
                              },
                            },
                            "delete",
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
    deleteId &&
      React.createElement(
        "div",
        {
          className: "modal-overlay",
          onClick: () => !deleteLoading && setDeleteId(null),
        },
        React.createElement(
          "div",
          {
            className: "modal-box",
            onClick: (e) => e.stopPropagation(),
          },
          React.createElement("h3", null, "Delete User"),
          React.createElement(
            "p",
            null,
            "Are you sure you want to delete this user? This action cannot be undone.",
          ),
          React.createElement(
            "div",
            {
              className: "modal-actions",
            },
            React.createElement(
              "button",
              {
                className: "btn btn-secondary btn-sm",
                onClick: () => setDeleteId(null),
                disabled: deleteLoading,
              },
              "Cancel",
            ),
            React.createElement(
              "button",
              {
                className: "btn btn-danger btn-sm",
                onClick: handleDelete,
                disabled: deleteLoading,
              },
              deleteLoading &&
                React.createElement("div", {
                  className: "spinner",
                  style: {
                    borderTopColor: "#fff",
                    width: "0.875rem",
                    height: "0.875rem",
                  },
                }),
              "Delete",
            ),
          ),
        ),
      ),
  );
}
