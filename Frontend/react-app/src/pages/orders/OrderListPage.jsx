import React from 'react';
import { AuthAPI, UserAPI, OrderAPI, TokenService } from '../../services/api';

function OrderListPage({ onNavigate }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await OrderAPI.getOrders();
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const statusClass = (s) => (s || "").toLowerCase();
  const formatCurrency = (n) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n || 0);
  };
  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Orders
          </h2>
          <p>
            Manage and track all customer orders.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate("create-order")}
            id="btn-create-order">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1rem",
              }}>
              add
            </span>
            Create Order
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
        Order list uses simulated data. Backend GET /orders endpoint is not yet implemented.
      </div>
      {error &&
        <div className="alert alert-error">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1rem",
            }}>
            error
          </span>
          {error}
        </div>}
      {loading
        ? <div className="loading-center">
        <div className="spinner spinner-lg" />
      </div>
        : orders.length === 0
          ? <div className="empty-state">
        <span className="material-symbols-outlined">
          receipt_long
        </span>
        <h3>
          No orders yet
        </h3>
        <p>
          Create your first order to get started.
        </p>
        <button
          className="btn btn-primary"
          style={{
            marginTop: "1rem",
          }}
          onClick={() => onNavigate("create-order")}>
          Create Order
        </button>
      </div>
          : <div
        className="card"
        style={{
          padding: "0.5rem 0",
        }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>
                  Order ID
                </th>
                <th>
                  Customer
                </th>
                <th>
                  Status
                </th>
                <th>
                  Items
                </th>
                <th>
                  Total
                </th>
                <th>
                  Date
                </th>
                <th
                  style={{
                    textAlign: "right",
                  }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) =>
                <tr key={o.id}>
                  <td
                    className="font-medium"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.8125rem",
                    }}>
                    {o.id.substring(0, 8)}
                    …
                  </td>
                  <td className="font-medium">
                    {o.customerName}
                  </td>
                  <td>
                    <span className={`status-badge ${statusClass(o.orderStatus)}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td>
                    {o.itemCount}
                    {" item"}
                    {o.itemCount !== 1 ? "s" : ""}
                  </td>
                  <td className="font-medium">
                    {formatCurrency(o.totalAmount)}
                  </td>
                  <td>
                    {formatDate(o.createdAt)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                    }}>
                    <button
                      className="btn-ghost"
                      style={{
                        padding: "0.25rem",
                      }}
                      onClick={() => onNavigate("order-details:" + o.id)}
                      title="View details">
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "1.125rem",
                        }}>
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>,
              )}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
}

export default OrderListPage;
