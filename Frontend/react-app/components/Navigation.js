function Navigation({ currentRoute, onNavigate }) {
  const { user, logout } = useAuth();
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "shopping_cart",
    },
    {
      id: "users",
      label: "Users",
      icon: "group",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: "inventory_2",
    },
    {
      id: "warehouse-operations",
      label: "Warehouse",
      icon: "warehouse",
    },
  ];
  const handleLogout = () => {
    logout();
    onNavigate("login");
  };
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";
  const roleName = (user?.role || "").replace("ROLE_", "");
  return React.createElement(
    "nav",
    {
      className: "sidebar",
      id: "sidebar",
    },
    React.createElement(
      "div",
      {
        className: "sidebar-brand",
      },
      React.createElement("h1", null, "LogiX"),
      React.createElement("p", null, "Kinetic Architect"),
    ),
    React.createElement(
      "ul",
      {
        className: "nav-list",
      },
      navItems.map((item) =>
        React.createElement(
          "li",
          {
            key: item.id,
            className: `nav-item${currentRoute === item.id || currentRoute.startsWith(item.id) ? " active" : ""}${item.disabled ? " disabled" : ""}`,
          },
          React.createElement(
            "a",
            {
              href: "#",
              onClick: (e) => {
                e.preventDefault();
                if (!item.disabled) onNavigate(item.id);
              },
              style: item.disabled
                ? {
                    opacity: 0.45,
                    cursor: "default",
                  }
                : {},
              title: item.disabled ? "Coming soon" : item.label,
            },
            React.createElement(
              "span",
              {
                className: "material-symbols-outlined",
              },
              item.icon,
            ),
            React.createElement("span", null, item.label),
            item.disabled &&
              React.createElement(
                "span",
                {
                  style: {
                    fontSize: "0.625rem",
                    opacity: 0.7,
                  },
                },
                "Soon",
              ),
          ),
        ),
      ),
      React.createElement(
        "li",
        {
          style: {
            padding: "0.5rem 1rem",
          },
        },
        React.createElement("div", {
          className: "divider",
          style: {
            margin: "0.5rem 0",
          },
        }),
      ),
      React.createElement(
        "li",
        {
          className: "nav-item",
        },
        React.createElement(
          "button",
          {
            onClick: handleLogout,
          },
          React.createElement(
            "span",
            {
              className: "material-symbols-outlined",
            },
            "logout",
          ),
          React.createElement("span", null, "Logout"),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "sidebar-profile",
      },
      React.createElement(
        "div",
        {
          className: "sidebar-profile-avatar",
        },
        initials,
      ),
      React.createElement(
        "div",
        {
          className: "sidebar-profile-info",
        },
        React.createElement("p", null, user?.name || "User"),
        React.createElement("p", null, roleName || "Member"),
      ),
    ),
  );
}
