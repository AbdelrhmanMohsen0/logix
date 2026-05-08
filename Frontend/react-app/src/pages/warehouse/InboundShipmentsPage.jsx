import React from 'react';
import { WarehouseAPI } from '../../services/api';
import Pagination from '../../components/Pagination';

function InboundShipmentsPage({ searchQuery, onNavigate }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [page, setPage] = React.useState(0);
  const [pageInfo, setPageInfo] = React.useState({ totalElements: 0 });
  const pageSize = 5;

  React.useEffect(() => {
    WarehouseAPI.getInbound(page, pageSize)
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
    return (
      (o.shipmentID && o.shipmentID.toLowerCase().includes(q)) ||
      (o.supplierName && o.supplierName.toLowerCase().includes(q))
    );
  });

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

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
      <div className="card" style={{ padding: "0.5rem 0" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Shipment Title</th>
                <th>Supplier Name</th>
                <th>Total Items</th>
                <th>Receiving Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>Loading...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                    No orders found for "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.shipmentID}>
                    <td className="font-medium" style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>
                      {o.shipmentID}
                    </td>
                    <td className="font-medium">{o.supplierName}</td>
                    <td>{o.totalNumberOfItems}</td>
                    <td>{formatDate(o.receivingDate)}</td>
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

export default InboundShipmentsPage;
