import React from 'react';

function WarehouseOperationsPage({ onNavigate }) {
  
  return (
    <div>
      <div className="page-header" style={{ marginBottom: "2.5rem" }}>
        <div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800" }}>
            Warehouse Operations
          </h2>
          <p style={{ fontSize: "1.125rem" }}>
            Select a module to manage kinetic workflow.
          </p>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
        }}>
        <div
          className="card module-card"
          onClick={() => onNavigate("inbound-shipments")}>
          <div className="icon-container">
            <span className="material-symbols-outlined">
              input
            </span>
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
            Inbound
          </h3>
          <p>
            Receive and stock items
          </p>
        </div>
        <div className="card module-card" onClick={() => onNavigate("picking-lists")}>
          <div className="icon-container">
            <span className="material-symbols-outlined">
              shopping_basket
            </span>
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
            Picking & Packing
          </h3>
          <p>
            Fulfill customer orders
          </p>
        </div>
        <div className="card module-card" onClick={() => onNavigate("shipments")}>
          <div className="icon-container">
            <span className="material-symbols-outlined">
              package_2
            </span>
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
            Shipments
          </h3>
          <p>
            Ship customer orders
          </p>
        </div>
      </div>
    </div>
  );
}

export default WarehouseOperationsPage;
