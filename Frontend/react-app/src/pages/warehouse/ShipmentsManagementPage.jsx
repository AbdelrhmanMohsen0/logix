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

  const handleUpdateStatus = async (id, status) => {
    try {
      await OrderAPI.updateOrderStatus(id, status);
      const updated = await OrderAPI.getOrders();
      setOrders(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter(s => {
    if (!["PACKED", "SHIPPED", "DELIVERED"].includes(s.orderStatus)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.customerName && s.customerName.toLowerCase().includes(q)) ||
      (s.supplierName && s.supplierName.toLowerCase().includes(q))
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
                      <div style={{ textAlign: "right", display: "flex", gap: "0.25rem", justifyContent: "flex-end" }}>
                      {o.orderStatus === "PACKED" && (
                        <button
                          className="btn-ghost"
                          title="Mark as Shipped"
                          onClick={() => handleUpdateStatus(o.id, "SHIPPED")}>
                          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                            local_shipping
                          </span>
                        </button>
                      )}
                      {o.orderStatus === "SHIPPED" && (
                        <button
                          className="btn-ghost"
                          title="Mark as Delivered"
                          onClick={() => handleUpdateStatus(o.id, "DELIVERED")}>
                          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                            task_alt
                          </span>
                        </button>
                      )}
                      </div>
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
