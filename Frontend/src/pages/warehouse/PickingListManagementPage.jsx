import React from 'react';

function PickingListManagementPage({ onNavigate }) {
  
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Picking Management Dashboard
          </h2>
          <p>
            Advanced picking assignment and statistics.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate("picking-lists")}>
            Back to Lists
          </button>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-label">
            Pending Picks
          </div>
          <div className="kpi-value">
            42
          </div>
        </div>
        <div className="card kpi-card">
          <div className="kpi-label">
            Active Pickers
          </div>
          <div className="kpi-value">
            8
          </div>
        </div>
        <div className="card kpi-card">
          <div className="kpi-label">
            Completed Today
          </div>
          <div className="kpi-value" style={{ color: "var(--success)" }}>
            124
          </div>
        </div>
      </div>
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>
          Picker Workloads
        </h3>
        <p style={{ color: "var(--on-surface-variant)" }}>
          Mock Data: Picker assignment and load visualization will render here once warehouse-service is deployed.
        </p>
      </div>
    </div>
  );
}

export default PickingListManagementPage;
