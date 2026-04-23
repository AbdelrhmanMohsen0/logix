import React from 'react';
import Navigation from './Navigation';

function Layout({ currentRoute, onNavigate, searchQuery, setSearchQuery, children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [currentRoute]);

  const getSearchPlaceholder = () => {
    switch (currentRoute) {
      case "dashboard": return "Search dashboard...";
      case "orders": return "Search by Order ID or Customer Name";
      case "users": return "Search by Name or Email";
      case "inventory": return "Search by SKU or Product Name";
      case "inbound-shipments": return "Search by Shipment ID or Supplier Name";
      case "picking-lists": return "Search by Picker, Pick List ID, or Order ID";
      case "shipments": return "Search by Shipment ID, Customer Name, or Address";
      default: return "Search...";
    }
  };
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
              <input 
                type="text" 
                placeholder={getSearchPlaceholder()} 
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="top-header-right">
            <button className="notification-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">
                notifications
              </span>
              <span className="notification-dot" />
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
