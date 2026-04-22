import React from 'react';

function InventoryManagementPage({ onNavigate }) {
  
  const [items, setItems] = React.useState([
    {
      sku: "ELEC-001",
      name: "Wireless Keyboard",
      qty: 154,
      loc: "Zone A - A12",
      updated: "2025-10-25",
    },
    {
      sku: "OFF-010",
      name: "Ergonomic Chair",
      qty: 28,
      loc: "Zone C - C04",
      updated: "2025-10-24",
    },
    {
      sku: "STAT-005",
      name: "Notebook Bundle",
      qty: 450,
      loc: "Zone B - B02",
      updated: "2025-10-25",
    },
  ]);
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Inventory Management
          </h2>
          <p>
            View and adjust current stock levels across all zones.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => alert("Mock: Adjust Stock")}>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              settings
            </span>
            Adjust Stock
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => alert("Mock: Add Stock")}>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              add
            </span>
            Add Stock
          </button>
        </div>
      </div>
      <div className="alert alert-info" style={{ marginBottom: "1.5rem" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
          info
        </span>
        Inventory data is simulated. Backend GET /inventory endpoint is not yet implemented.
      </div>
      <div className="card" style={{ padding: "0.5rem 0" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>
                  SKU
                </th>
                <th>
                  Product Name
                </th>
                <th>
                  Quantity
                </th>
                <th>
                  Location
                </th>
                <th>
                  Last Updated
                </th>
                <th style={{ textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) =>
                <tr key={idx}>
                  <td
                    className="font-medium"
                    style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>
                    {i.sku}
                  </td>
                  <td className="font-medium">
                    {i.name}
                  </td>
                  <td>
                    {i.qty > 50
                      ? <span className="status-badge success">
                      {i.qty}
                    </span>
                      : <span className="status-badge delayed">
                      {i.qty}
                    </span>}
                  </td>
                  <td>
                    {i.loc}
                  </td>
                  <td>
                    {i.updated}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-ghost" title="Edit details">
                      <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                        edit
                      </span>
                    </button>
                  </td>
                </tr>,
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryManagementPage;
