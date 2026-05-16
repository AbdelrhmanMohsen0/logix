import React from 'react';
import { useAuth } from '../context/AuthContext';

function Navigation({ currentRoute, onNavigate, isOpen }) {
  const { user, logout, hasAccess } = useAuth();

  const allNavItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", page: "dashboard" },
    { id: "orders", label: "Orders", icon: "shopping_cart", page: "orders" },
    { id: "users", label: "Users", icon: "group", page: "users" },
    { id: "inventory", label: "Inventory", icon: "inventory_2", page: "inventory" },
    { id: "warehouse-operations", label: "Warehouse", icon: "warehouse", page: "warehouse-operations" },
  ];

  const navItems = allNavItems.filter((item) => hasAccess(item.page));

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
  return (
    <nav className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
      <div className="sidebar-brand">
        <h1>
          LogiX
        </h1>
        <p>
          Kinetic Architect
        </p>
      </div>
      <ul className="nav-list">
        {navItems.map((item) =>
          <li
            key={item.id}
            className={`nav-item${currentRoute === item.id || currentRoute.startsWith(item.id) ? " active" : ""}`}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id);
              }}
              title={item.label}>
              <span className="material-symbols-outlined">
                {item.icon}
              </span>
              <span>
                {item.label}
              </span>
            </a>
          </li>,
        )}
      </ul>
      <div className="sidebar-profile" style={{ marginBottom: "0.5rem" }}>
        <div className="sidebar-profile-avatar">
          {initials}
        </div>
        <div className="sidebar-profile-info">
          <p>
            {user?.name || "User"}
          </p>
          <p>
            {roleName || "Member"}
          </p>
        </div>
      </div>
      <div style={{ padding: "0 1rem" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            width: "100%",
            padding: "0.75rem 1rem",
            border: "none",
            borderRadius: "0.5rem",
            background: "transparent",
            color: "var(--error)",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(186, 26, 26, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}>
          <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
            logout
          </span>
          <span>
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Navigation;

