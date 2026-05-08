import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InventoryAPI, OrderAPI, WarehouseAPI } from '../../services/api';

function DashboardPage({ searchQuery, onNavigate }) {
  const { user, hasAccess } = useAuth();
  const role = (user?.role || '').replace('ROLE_', '');
  
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingShipments, setPendingShipments] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [orders, setOrders] = useState([]);

  React.useEffect(() => {
    OrderAPI.getOrders()
      .then(data => {
        setTotalOrders(data?.length || 0);
        setOrders((data || []).slice(0, 5));
      })
      .catch(e => console.warn(e));
      
    InventoryAPI.getProducts(0, 1, "LOW_STOCK")
      .then(data => setLowStockCount(data?.page?.totalElements || 0))
      .catch(e => console.warn(e));
      
    InventoryAPI.getProducts(0, 1, "ALL")
      .then(data => setTotalProducts(data?.page?.totalElements || 0))
      .catch(e => console.warn(e));
      
    WarehouseAPI.getOutbound()
      .then(data => setPendingShipments(data?.length || 0))
      .catch(e => console.warn(e));
  }, []);

  const allKpis = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: "shopping_cart",
      iconClass: "primary",
      active: true,
      roles: ['OWNER', 'ADMIN', 'MANAGER', 'SALES'],
    },
    {
      label: "Pending Shipments",
      value: pendingShipments.toString(),
      icon: "local_shipping",
      iconClass: "secondary",
      roles: ['OWNER', 'ADMIN', 'MANAGER', 'WORKER'],
    },
    {
      label: "Total Products",
      value: totalProducts.toString(),
      icon: "inventory_2",
      iconClass: "secondary",
      roles: ['OWNER', 'ADMIN', 'MANAGER', 'WORKER'],
    },
    {
      id: "low_stock",
      label: "Low Stock Alerts",
      value: lowStockCount.toString(),
      icon: "warning",
      iconClass: "error",
      valueClass: "error-text",
      action: "Review items →",
      roles: ['OWNER', 'ADMIN', 'MANAGER'],
    },
  ];

  const kpis = allKpis.filter(k => !k.roles || k.roles.includes(role));

  const filteredActivity = orders.filter(row => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (row.orderDisplayIndex && row.orderDisplayIndex.toLowerCase().includes(q)) ||
      (row.customerName && row.customerName.toLowerCase().includes(q))
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
      <div className="page-header">
        <div>
          <h2>
            Overview
          </h2>
          <p>
            Monitor your logistics performance and critical alerts.
          </p>
        </div>
        <div className="page-actions">
          {hasAccess('inventory') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate("inventory")}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "1rem",
                }}>
                add
              </span>
              Add Product
            </button>
          )}
          {hasAccess('create-order') && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onNavigate("create-order")}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "1rem",
                }}>
                bolt
              </span>
              Create Order
            </button>
          )}
        </div>
      </div>
      <div className="kpi-grid">
        {kpis.map((k, i) =>
          <div className={`card kpi-card${k.active ? " active" : ""}`} key={i}>
            <div className="kpi-card-header">
              <span className="kpi-label">
                {k.label}
              </span>
              <div className={`kpi-icon ${k.iconClass}`}>
                <span className="material-symbols-outlined">
                  {k.icon}
                </span>
              </div>
            </div>
            <div className={`kpi-value${k.valueClass ? " " + k.valueClass : ""}`}>
              {k.value}
            </div>
            {k.id === "low_stock" && lowStockCount > 0 && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>
                {lowStockCount} items
              </div>
            )}
            <div className="kpi-trend">
              {k.action
                ? <a
                href="#"
                onClick={(e) => { 
                  e.preventDefault(); 
                  if(k.id === "low_stock") onNavigate("inventory:lowstock"); 
                }}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}>
                {k.action}
              </a>
                : null }
            </div>
          </div>
        )}
      </div>
      <div
        className="card"
        style={{
          padding: "1.5rem",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}>
          <h3>
            Recent Activity
          </h3>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("orders");
            }}
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
            }}>
            View All
          </a>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivity.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                    No results found for "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredActivity.map((row, i) => (
                  <tr key={i}>
                    <td className="font-medium" style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>
                      {row.orderDisplayIndex}
                    </td>
                    <td className="font-medium">{row.customerName}</td>
                    <td className="font-medium">{formatCurrency(row.totalAmount)}</td>
                    <td>{formatDate(row.orderDate)}</td>
                    <td>
                      <span className={`status-badge ${statusClass(row.currentStatus)}`}>
                        {row.currentStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-ghost"
                        style={{ padding: "0.25rem" }}
                        onClick={() => onNavigate("order-details:" + row.id)}>
                        <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                          visibility
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

export default DashboardPage;
