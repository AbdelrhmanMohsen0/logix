import React from 'react';
import { OrderAPI } from '../../services/api';

function PickingListPage({ searchQuery, onNavigate }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    OrderAPI.getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filteredOrders = orders.filter(o => {
    if (o.orderStatus !== "PENDING" && o.orderStatus !== "IN_PROGRESS") return false;
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

  const handleStartWork = async (id) => {
    try {
      await OrderAPI.updateOrderStatus(id, "IN_PROGRESS");
      const updated = await OrderAPI.getOrders();
      setOrders(updated);
    } catch (e) {
      console.error(e);
    }
  };

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
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Supplier Name</th>
                <th>Items</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" style={{ textAlign: "center", padding: "2rem" }}>Loading...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "2rem" }}>
                    No picking lists found for "{searchQuery}"
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
                    <td style={{ textAlign: "right" }}>
                      {o.orderStatus === "PENDING" && (
                        <button
                          className="btn-ghost"
                          onClick={() => handleStartWork(o.id)}
                          title="Start Work">
                          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                            play_arrow
                          </span>
                        </button>
                      )}
                      <button
                        className="btn-ghost"
                        onClick={() => onNavigate("picking-details:" + o.id)}
                        title={o.orderStatus === "IN_PROGRESS" ? "Continue Picking" : "View Details"}>
                        <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                          checklist
                        </span>
                      </button>
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

export default PickingListPage;
