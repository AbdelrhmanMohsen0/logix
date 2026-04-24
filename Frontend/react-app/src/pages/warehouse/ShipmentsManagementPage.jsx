import React from 'react';
import { OrderAPI } from '../../services/api';

function ShipmentsManagementPage({ searchQuery, onNavigate }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    OrderAPI.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const markShipped = async (id) => {
    // In a real app, this would call OrderAPI.updateOrderStatus
    // Since we're doing frontend-only in-memory, we can just update the list
    try {
      await OrderAPI.updateOrderStatus(id, "SHIPPED");
      const updated = await OrderAPI.getOrders();
      setOrders(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.supplierName && o.supplierName.toLowerCase().includes(q))
    );
  });

  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  const statusClass = (s) => (s || "").toLowerCase();

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
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Supplier Name</th>
                <th>Items</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" style={{ textAlign: "center", padding: "2rem" }}>Loading...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "2rem" }}>
                    No shipments found for "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="font-medium" style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>
                      {o.id}
                    </td>
                    <td className="font-medium">{o.customerName}</td>
                    <td>{o.supplierName}</td>
                    <td>{o.items ? o.items.map(i => i.name).join(", ") : "—"}</td>
                    <td>{o.items ? o.items.reduce((sum, i) => sum + i.quantity, 0) : 0}</td>
                    <td className="font-medium">{formatCurrency(o.totalAmount)}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${statusClass(o.orderStatus)}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td>
                      {o.orderStatus !== "SHIPPED" && o.orderStatus !== "DELIVERED" && (
                        <button
                          className="btn btn-primary"
                          style={{
                            padding: "0.375rem 1rem",
                            fontSize: "0.8125rem",
                            borderRadius: "0.375rem",
                          }}
                          onClick={() => markShipped(o.id)}>
                          Mark as Shipped
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShipmentsManagementPage;
