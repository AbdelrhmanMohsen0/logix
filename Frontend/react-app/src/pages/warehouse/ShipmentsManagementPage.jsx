import React from 'react';
import { WarehouseAPI } from '../../services/api';
import Pagination from '../../components/Pagination';

function ShipmentsManagementPage({ searchQuery, onNavigate }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  const [page, setPage] = React.useState(0);
  const pageSize = 10;

  const fetchShipments = React.useCallback(() => {
    setLoading(true);
    WarehouseAPI.getOutbound()
      .then((data) => {
        setOrders(data?.content || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleShip = async (orderId) => {
    try {
      await WarehouseAPI.shipOrder(orderId);
      alert("Order marked as shipped!");
      fetchShipments(); // refresh list
    } catch (e) {
      console.error(e);
      alert("Error shipping order: " + e.message);
    }
  };

  const filteredOrders = orders.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.orderId && s.orderId.toLowerCase().includes(q)) ||
      (s.customerName && s.customerName.toLowerCase().includes(q))
    );
  });
  
  const paginatedOrders = filteredOrders.slice(page * pageSize, (page + 1) * pageSize);

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
                <th>Customer</th>
                <th>Ship To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>Loading...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                    {searchQuery ? `No shipments found for "${searchQuery}"` : "No packed orders ready for shipment."}
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => (
                  <tr key={o.orderId}>
                    <td className="font-medium" style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>
                      {o.orderId}
                    </td>
                    <td className="font-medium">{o.customerName}</td>
                    <td>{o.customerAddress}</td>
                    <td>
                      <div style={{ textAlign: "right", display: "flex", gap: "0.25rem", justifyContent: "flex-end" }}>
                        <button
                          className="btn-ghost"
                          title="Mark as Shipped"
                          onClick={() => handleShip(o.orderId)}>
                          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                            local_shipping
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(filteredOrders.length / pageSize)}
          totalElements={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default ShipmentsManagementPage;
