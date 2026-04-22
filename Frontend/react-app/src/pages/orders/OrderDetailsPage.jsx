import React from 'react';
import { AuthAPI, UserAPI, OrderAPI, TokenService } from '../../services/api';

function OrderDetailsPage({ orderId, onNavigate }) {
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [statusLoading, setStatusLoading] = React.useState(false);
  const fetchOrder = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await OrderAPI.getOrder(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);
  React.useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);
  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n || 0);
  const formatDateTime = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const statusClass = (s) => (s || "").toLowerCase();
  const allStatuses = [
    "CREATED",
    "PENDING",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
  ];
  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    try {
      const updated = await OrderAPI.updateOrderStatus(orderId, newStatus);
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner spinner-lg" />
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <div className="alert alert-error">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1rem",
            }}>
            error
          </span>
          {error}
        </div>
        <button className="btn btn-secondary" onClick={() => onNavigate("orders")}>
          ← Back to Orders
        </button>
      </div>
    );
  }
  if (!order) return null;
  return (
    <div>
      <div className="page-header">
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.25rem",
            }}>
            <h2
              style={{
                margin: 0,
              }}>
              Order Details
            </h2>
            <span className={`status-badge ${statusClass(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.8125rem",
            }}>
            {order.id}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("orders")}>
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1rem",
              }}>
              arrow_back
            </span>
            Back to Orders
          </button>
        </div>
      </div>
      <div
        className="alert alert-info"
        style={{
          marginBottom: "1.5rem",
        }}>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "1rem",
          }}>
          info
        </span>
        Order details are simulated. Backend GET /order/
        {orderId}
        {" endpoint is not yet implemented."}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
        }}>
        <div>
          <div
            className="card"
            style={{
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}>
            <h3
              style={{
                marginBottom: "1.25rem",
              }}>
              Customer Information
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>
                  Customer Name
                </label>
                <p>
                  {order.customerName}
                </p>
              </div>
              <div className="detail-item">
                <label>
                  Phone
                </label>
                <p>
                  {order.customerPhone}
                </p>
              </div>
              <div className="detail-item">
                <label>
                  Address
                </label>
                <p>
                  {order.customerAddress}
                </p>
              </div>
              <div className="detail-item">
                <label>
                  Total Amount
                </label>
                <p
                  style={{
                    color: "var(--primary)",
                    fontWeight: 700,
                  }}>
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
          <div
            className="card"
            style={{
              padding: "1.5rem",
            }}>
            <h3
              style={{
                marginBottom: "1.25rem",
              }}>
              Order Items (
              {order.items.length}
              )
            </h3>
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
                      Qty
                    </th>
                    <th>
                      Unit Price
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                      }}>
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) =>
                    <tr key={i}>
                      <td
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.8125rem",
                        }}>
                        {item.SKU}
                      </td>
                      <td className="font-medium">
                        {item.name}
                      </td>
                      <td>
                        {item.quantity}
                      </td>
                      <td>
                        {formatCurrency(item.priceAtPurchase)}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: 500,
                        }}>
                        {formatCurrency(item.quantity * item.priceAtPurchase)}
                      </td>
                    </tr>,
                  )}
                </tbody>
              </table>
            </div>
            <div className="total-bar">
              <span
                style={{
                  color: "var(--on-surface-variant)",
                  fontWeight: 500,
                }}>
                Total:
              </span>
              <span>
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
        <div>
          <div
            className="card"
            style={{
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}>
            <h3
              style={{
                marginBottom: "1rem",
              }}>
              Update Status
            </h3>
            <div
              className="form-group"
              style={{
                marginBottom: "0.75rem",
              }}>
              <select
                className="form-input"
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusLoading}>
                {allStatuses.map((s) =>
                  <option key={s} value={s}>
                    {s}
                  </option>,
                )}
              </select>
            </div>
            {statusLoading &&
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.8125rem",
                  color: "var(--on-surface-variant)",
                }}>
                <div className="spinner" />
                Updating…
              </div>}
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--outline)",
                marginTop: "0.5rem",
              }}>
              Mock — PUT /order/
              {orderId}
              /status is not yet implemented.
            </p>
          </div>
          <div
            className="card"
            style={{
              padding: "1.5rem",
            }}>
            <h3
              style={{
                marginBottom: "1.25rem",
              }}>
              Status History
            </h3>
            <div className="timeline">
              {[...order.statusHistory].reverse().map((sh, i) =>
                <div className="timeline-item" key={i}>
                  <div className="timeline-dot" />
                  <h4>
                    {sh.status}
                  </h4>
                  <time>
                    {formatDateTime(sh.transitionedAt)}
                  </time>
                </div>,
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
