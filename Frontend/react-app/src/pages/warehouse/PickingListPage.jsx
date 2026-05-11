import React from 'react';
import { WarehouseAPI } from '../../services/api';
import Pagination from '../../components/Pagination';

function PickingListPage({ searchQuery, onNavigate }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  const [page, setPage] = React.useState(0);
  const [pageInfo, setPageInfo] = React.useState({ totalElements: 0 });
  const pageSize = 5;

  React.useEffect(() => {
    WarehouseAPI.getPickingList(page, pageSize)
      .then((data) => {
        setOrders(data?.content || []);
        setPageInfo(data?.page || { totalElements: 0 });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [page, pageSize]);

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.orderId && o.orderId.toLowerCase().includes(q);
  });
  
  const paginatedOrders = filteredOrders.slice(page * pageSize, (page + 1) * pageSize);

  const statusClass = (s) => (s || "").toLowerCase();

  const handleStartWork = async (id) => {
    try {
      await WarehouseAPI.startPicking(id);
      onNavigate("picking-details:" + id);
    } catch (e) {
      if (e.message?.includes("locked") || e.response?.status === 423) {
        alert("This order is currently locked and being processed by another worker.");
      } else {
        alert("Failed to start picking: " + e.message);
      }
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
      </div>
      <div className="card" style={{ padding: "0.5rem 0" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total Items</th>
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
                  <tr key={o.orderId}>
                    <td className="font-medium" style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>
                      {o.orderDisplayIndex || o.orderId}
                    </td>
                    <td>{o.numberOfItems}</td>
                    <td>
                      <span className={`status-badge ${statusClass(o.orderWarehouseStatus)}`}>
                        {o.orderWarehouseStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {o.orderWarehouseStatus === "PENDING" && (
                        <button
                          className="btn-ghost"
                          onClick={() => handleStartWork(o.orderId)}
                          title="Start Work">
                          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                            play_arrow
                          </span>
                        </button>
                      )}
                      {o.orderWarehouseStatus === "IN_PROGRESS" && (
                        <button
                          className="btn-ghost"
                          onClick={() => handleStartWork(o.orderId)}
                          title="Continue Picking">
                          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                            checklist
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
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
      </div>
    </div>
  );
}

export default PickingListPage;
