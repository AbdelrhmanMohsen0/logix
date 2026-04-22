import React from 'react';
import Navigation from './Navigation';

function Layout({ currentRoute, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [currentRoute]);
  return (
    <div className="app-layout">
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)} />
      <div
        style={sidebarOpen
          ? {
              position: "fixed",
              zIndex: 50,
            }
          : undefined}>
        <Navigation currentRoute={currentRoute} onNavigate={onNavigate} />
      </div>
      {sidebarOpen &&
        <style>
          {`.sidebar { transform: translateX(0) !important; }`}
        </style>}
      <div className="main-content">
        <header className="top-header">
          <div className="top-header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle menu">
              <span className="material-symbols-outlined">
                menu
              </span>
            </button>
            <div className="top-header-search">
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "1.125rem",
                  color: "var(--outline)",
                }}>
                search
              </span>
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="top-header-right">
            <button className="notification-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">
                notifications
              </span>
              <span className="notification-dot" />
            </button>
            <button
              className="btn-ghost"
              style={{
                padding: "0.25rem",
              }}
              aria-label="Help">
              <span className="material-symbols-outlined">
                help_outline
              </span>
            </button>
          </div>
        </header>
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
