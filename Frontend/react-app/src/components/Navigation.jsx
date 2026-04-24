import React from 'react';
import { useAuth } from '../context/AuthContext';

function Navigation({ currentRoute, onNavigate, isOpen }) {
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
            className={`nav-item${currentRoute === item.id || currentRoute.startsWith(item.id) ? " active" : ""}${item.disabled ? " disabled" : ""}`}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!item.disabled) onNavigate(item.id);
              }}
              style={item.disabled
                ? {
                  opacity: 0.45,
                  cursor: "default",
                }
                : {}}
              title={item.disabled ? "Coming soon" : item.label}>
              <span className="material-symbols-outlined">
                {item.icon}
              </span>
              <span>
                {item.label}
              </span>
              {item.disabled &&
                <span
                  style={{
                    fontSize: "0.625rem",
                    opacity: 0.7,
                  }}>
                  Soon
                </span>}
            </a>
          </li>,
        )}
        <li
          style={{
            padding: "0.5rem 1rem",
          }}>
          <div
            className="divider"
            style={{
              margin: "0.5rem 0",
            }} />
        </li>
        <li className="nav-item">
          <button onClick={handleLogout}>
            <span className="material-symbols-outlined">
              logout
            </span>
            <span>
              Logout
            </span>
          </button>
        </li>
      </ul>
      <div className="sidebar-profile">
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
    </nav>
  );
}

export default Navigation;
