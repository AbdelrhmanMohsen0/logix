import React from 'react';

function ShipmentsManagementPage({ onNavigate }) {
  
  const [shipments, setShipments] = React.useState([
    {
      orderId: "#ORD-8821",
      customer: "James Wilson",
      address: "452 Industrial Way, Suite 10, Seattle, WA 98101",
    },
    {
      orderId: "#ORD-8822",
      customer: "Sarah Miller",
      address: "1209 East Maple Blvd, Austin, TX 78701",
    },
    {
      orderId: "#ORD-8823",
      customer: "Tech Corp Solutions",
      address: "88 Market Street, Floor 4, San Francisco, CA 94105",
    },
    {
      orderId: "#ORD-8824",
      customer: "Robert Chen",
      address: "2130 Ventura Blvd, Los Angeles, CA 90012",
    },
  ]);
  const markShipped = (idx) => {
    setShipments((s) => s.filter((_, i) => i !== idx));
  };
  return (
    <div>
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800" }}>
            Shipments
          </h2>
          <p style={{ fontSize: "1.125rem" }}>
            Manage and track outgoing inventory shipments to customers.
          </p>
        </div>
      </div>
      <div className="card" style={{ padding: "0.5rem 0" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>
                  ORDER ID
                </th>
                <th>
                  CUSTOMER NAME
                </th>
                <th>
                  ADDRESS
                </th>
                <th>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s, idx) =>
                <tr key={idx}>
                  <td
                    className="font-medium"
                    style={{ color: "var(--primary)", fontWeight: "600" }}>
                    {s.orderId}
                  </td>
                  <td>
                    {s.customer}
                  </td>
                  <td>
                    {s.address}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{
                        padding: "0.375rem 1rem",
                        fontSize: "0.8125rem",
                        borderRadius: "0.375rem",
                      }}
                      onClick={() => markShipped(idx)}>
                      Mark as Shipped
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

export default ShipmentsManagementPage;
