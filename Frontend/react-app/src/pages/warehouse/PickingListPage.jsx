import React from 'react';

function PickingListPage({ onNavigate }) {
  
  const [lists] = React.useState([
    {
      id: "PICK-101",
      order: "ORD-5521",
      status: "PENDING",
      picker: "Unassigned",
      items: 5,
      priority: "HIGH",
    },
    {
      id: "PICK-102",
      order: "ORD-5522",
      status: "IN-PROGRESS",
      picker: "M. Chen",
      items: 12,
      priority: "NORMAL",
    },
    {
      id: "PICK-103",
      order: "ORD-5519",
      status: "COMPLETED",
      picker: "T. Kim",
      items: 2,
      priority: "NORMAL",
    },
  ]);
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Picking Lists
          </h2>
          <p>
            Manage and track order fulfillment picking operations.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate("picking-management")}>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              settings
            </span>
            Management Dashboard
          </button>
        </div>
      </div>
      <div className="card" style={{ padding: "0.5rem 0" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>
                  Pick List ID
                </th>
                <th>
                  Order ID
                </th>
                <th>
                  Status
                </th>
                <th>
                  Picker
                </th>
                <th>
                  Items
                </th>
                <th style={{ textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {lists.map((l, idx) =>
                <tr key={idx}>
                  <td className="font-medium" style={{ fontFamily: "monospace" }}>
                    {l.id}
                  </td>
                  <td>
                    {l.order}
                  </td>
                  <td>
                    <span className={`status-badge ${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    {l.picker}
                  </td>
                  <td>
                    {l.items}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn-ghost"
                      onClick={() => onNavigate("picking-details:" + l.id)}
                      title="View / Start Picking">
                      <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                        checklist
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

export default PickingListPage;
