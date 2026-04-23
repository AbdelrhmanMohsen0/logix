import React from 'react';

function InboundShipmentsPage({ searchQuery, onNavigate }) {
  
  const [shipments] = React.useState([
    {
      id: "#SHP-1024",
      supplier: "Global Logistics Inc.",
      date: "Oct 24, 2023",
      items: "1,240",
    },
    {
      id: "#SHP-1025",
      supplier: "Nordic Supply Chain",
      date: "Oct 25, 2023",
      items: "850",
    },
    {
      id: "#SHP-1026",
      supplier: "Apex Manufacturing",
      date: "Oct 26, 2023",
      items: "425",
    },
    {
      id: "#SHP-1027",
      supplier: "Prime Electronics",
      date: "Oct 26, 2023",
      items: "3,110",
    },
    {
      id: "#SHP-1028",
      supplier: "Velocity Freight",
      date: "Oct 27, 2023",
      items: "2,480",
    },
    {
      id: "#SHP-1029",
      supplier: "Continental Spares",
      date: "Oct 28, 2023",
      items: "760",
    },
  ]);

  const filteredShipments = shipments.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.supplier && s.supplier.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800" }}>
            Inbound
          </h2>
          <p style={{ fontSize: "1.125rem" }}>
            Manage and track all incoming shipments, verify quantities, and assign storage locations within the facility.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            style={{ padding: "0.625rem 1.25rem" }}
            onClick={() => onNavigate("add-received-shipment")}>
            <span
              className="material-symbols-outlined"
              style={{ marginRight: "0.5rem", fontSize: "1.25rem" }}>
              add
            </span>
            Add New Received Shipment
          </button>
        </div>
      </div>
      <div className="card" style={{ padding: "0" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>
                  SHIPMENT ID
                </th>
                <th>
                  SUPPLIER
                </th>
                <th>
                  RECEIVING DATE
                </th>
                <th>
                  NUMBER OF ITEMS RECEIVED
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length === 0 && shipments.length > 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                    No shipments found for "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredShipments.map((s, idx) =>
                  <tr key={idx}>
                    <td
                      className="font-medium"
                      style={{ color: "var(--on-surface)", fontWeight: "700" }}>
                      {s.id}
                    </td>
                    <td>
                      {s.supplier}
                    </td>
                    <td>
                      {s.date}
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      {s.items}
                    </td>
                  </tr>,
                )
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--surface-container)",
          }}>
          <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
            Showing 1 to 6 of 128 entries
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              fontSize: "0.8125rem",
              fontWeight: "600",
              color: "var(--on-surface)",
            }}>
            <span style={{ color: "var(--outline-variant)", cursor: "pointer" }}>
              &lt;
            </span>
            <span style={{ cursor: "pointer" }}>
              1
            </span>
            <span style={{ cursor: "pointer" }}>
              2
            </span>
            <span style={{ cursor: "pointer" }}>
              3
            </span>
            <span style={{ color: "var(--outline-variant)" }}>
              ...
            </span>
            <span style={{ color: "var(--outline-variant)", cursor: "pointer" }}>
              &gt;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InboundShipmentsPage;
