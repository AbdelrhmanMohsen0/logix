function Layout({ currentRoute, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [currentRoute]);
  return React.createElement(
    "div",
    {
      className: "app-layout",
    },
    React.createElement("div", {
      className: `sidebar-overlay${sidebarOpen ? " open" : ""}`,
      onClick: () => setSidebarOpen(false),
    }),
    React.createElement(
      "div",
      {
        style: sidebarOpen
          ? {
              position: "fixed",
              zIndex: 50,
            }
          : undefined,
      },
      React.createElement(Navigation, {
        currentRoute: currentRoute,
        onNavigate: onNavigate,
      }),
    ),
    sidebarOpen &&
      React.createElement(
        "style",
        null,
        `.sidebar { transform: translateX(0) !important; }`,
      ),
    React.createElement(
      "div",
      {
        className: "main-content",
      },
      React.createElement(
        "header",
        {
          className: "top-header",
        },
        React.createElement(
          "div",
          {
            className: "top-header-left",
          },
          React.createElement(
            "button",
            {
              className: "mobile-menu-btn",
              onClick: () => setSidebarOpen((o) => !o),
              "aria-label": "Toggle menu",
            },
            React.createElement(
              "span",
              {
                className: "material-symbols-outlined",
              },
              "menu",
            ),
          ),
          React.createElement(
            "div",
            {
              className: "top-header-search",
            },
            React.createElement(
              "span",
              {
                className: "material-symbols-outlined",
                style: {
                  fontSize: "1.125rem",
                  color: "var(--outline)",
                },
              },
              "search",
            ),
            React.createElement("input", {
              type: "text",
              placeholder: "Search...",
            }),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "top-header-right",
          },
          React.createElement(
            "button",
            {
              className: "notification-btn",
              "aria-label": "Notifications",
            },
            React.createElement(
              "span",
              {
                className: "material-symbols-outlined",
              },
              "notifications",
            ),
            React.createElement("span", {
              className: "notification-dot",
            }),
          ),
          React.createElement(
            "button",
            {
              className: "btn-ghost",
              style: {
                padding: "0.25rem",
              },
              "aria-label": "Help",
            },
            React.createElement(
              "span",
              {
                className: "material-symbols-outlined",
              },
              "help_outline",
            ),
          ),
        ),
      ),
      React.createElement(
        "main",
        {
          className: "page-content",
        },
        children,
      ),
    ),
  );
}
