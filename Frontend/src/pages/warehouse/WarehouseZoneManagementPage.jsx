import React from 'react';

function WarehouseZoneManagementPage({ onNavigate }) {
  
  const [zones] = React.useState([
    { name: "Zone A - Electronics", capacity: 80, utilization: 65 },
    { name: "Zone B - Stationery", capacity: 100, utilization: 90 },
    { name: "Zone C - General", capacity: 200, utilization: 20 },
  ]);
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Zone Management
          </h2>
          <p>
            Configure warehouse geographic zones and limits.
          </p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigate("warehouse-operations")}>
          Back to Operations
        </button>
      </div>
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          {zones.map((z, idx) =>
            <div
              key={idx}
              style={{
                border: "1px solid var(--surface-container)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}>
                <h4>
                  {z.name}
                </h4>
                <span className="status-badge default">
                  {`Cap: ${z.capacity} units`}
                </span>
              </div>
              <div className="h-bar-track">
                <div
                  className="h-bar-fill"
                  style={{
                    width: `${z.utilization}%`,
                    background:
                      z.utilization > 85 ? "var(--error)" : "var(--primary)",
                  }} />
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--on-surface-variant)",
                }}>
                {`${z.utilization}% Utilized`}
              </div>
            </div>,
          )}
        </div>
      </div>
      <button className="btn btn-primary" onClick={() => alert("Mock: Add New Zone")}>
        Add New Zone
      </button>
    </div>
  );
}

export default WarehouseZoneManagementPage;
