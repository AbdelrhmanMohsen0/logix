import React from 'react';
import { AuthAPI, UserAPI, OrderAPI, TokenService } from '../../services/api';
import Pagination from '../../components/Pagination';

function OrderListPage({ searchQuery, onNavigate }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [page, setPage] = React.useState(0);
  const [pageInfo, setPageInfo] = React.useState({ totalElements: 0 });
  const pageSize = 5;

  // Debounce: only fire the search 400ms after the user stops typing
  const [debouncedQuery, setDebouncedQuery] = React.useState(searchQuery);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 0 whenever the debounced query changes
  React.useEffect(() => {
    setPage(0);
  }, [debouncedQuery]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await OrderAPI.getOrders(page, pageSize, debouncedQuery);
        if (!cancelled) {
          setOrders(data?.content || []);
          setPageInfo(data?.page || { totalElements: 0 });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, debouncedQuery]);
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
                      Customer Name
                    </th>
                    <th>
                      Total Amount
                    </th>
                    <th>
                      Date
                    </th>
                    <th>
                      Status
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
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                        {searchQuery ? `No orders found for "${searchQuery}"` : "No orders yet."}
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) =>
                      <tr key={o.id}>
                        <td
                          className="font-medium"
                          style={{
                            fontFamily: "monospace",
                            fontSize: "0.8125rem",
                          }}>
                          {o.orderDisplayIndex || o.id}
                        </td>
                        <td className="font-medium">
                          {o.customerName}
                        </td>
                        <td className="font-medium">
                          {formatCurrency(o.totalAmount)}
                        </td>
                        <td>
                          {formatDate(o.orderDate)}
                        </td>
                        <td>
                          <span className={`status-badge ${statusClass(o.currentStatus)}`}>
                            {o.currentStatus}
                          </span>
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
                    )
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={page}
              totalPages={pageInfo.totalPages || Math.ceil(pageInfo.totalElements / pageSize)}
              totalElements={pageInfo.totalElements}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>}
    </div>
  );
}

export default OrderListPage;
