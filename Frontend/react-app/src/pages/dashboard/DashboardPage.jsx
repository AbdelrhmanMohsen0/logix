import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { OrderAPI } from '../../services/api';

function DashboardPage({ searchQuery, onNavigate }) {
  const { user } = useAuth();
  const { items } = useInventory();
  const lowStockItems = items.filter(i => i.qty < 50);
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [orders, setOrders] = useState([]);
  
  React.useEffect(() => {
    OrderAPI.getOrders().then(data => setOrders(data.slice(0, 4)));
  }, []);

  const chartData = {
    "Last 30 Days": {
      data: [65, 85, 45, 95],
      orders: [143, 187, 99, 210],
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      peakIndex: 3,
    },
    "This Quarter": {
      data: [65, 45, 72, 58, 90, 78, 55, 82, 95, 68, 74, 88],
      orders: [310, 215, 345, 278, 430, 374, 263, 392, 475, 325, 354, 421],
      labels: ["Wk 1", "Wk 4", "Wk 8", "Wk 12"],
      peakIndex: 8,
    },
    "This Year": {
      data: [40, 30, 45, 50, 35, 60, 70, 55, 48, 52, 61, 85],
      orders: [980, 735, 1102, 1225, 858, 1470, 1715, 1348, 1176, 1274, 1494, 2100],
      labels: ["Jan", "Apr", "Jul", "Oct"],
      peakIndex: 11,
    }
  };
  const currentChart = chartData[timeRange];
  const kpis = [
    {
      label: "Total Orders",
      value: "12,485",
      icon: "shopping_cart",
      iconClass: "primary",
      trend: "+14%",
      trendDir: "up",
      note: "vs last month",
      active: true,
    },
    {
      label: "Pending Shipments",
      value: "842",
      icon: "local_shipping",
      iconClass: "secondary",
      trend: "-3%",
      trendDir: "down",
      note: "vs last month",
    },
    {
      label: "Inventory Levels",
      value: "94.2%",
      icon: "inventory_2",
      iconClass: "secondary",
      trend: "0%",
      trendDir: "up",
      note: "stable",
    },
    {
      id: "low_stock",
      label: "Low Stock Alerts",
      value: lowStockItems.length.toString(),
      icon: "warning",
      iconClass: "error",
      valueClass: "error-text",
      action: "Review items →",
    },
  ];
  
  const inventoryDist = [
    { label: "Electronics", pct: 45 },
    { label: "Apparel", pct: 30 },
    { label: "Home Goods", pct: 15 },
    { label: "Other", pct: 10 },
  ];

  const filteredActivity = orders.filter(row => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (row.id && row.id.toLowerCase().includes(q)) ||
      (row.customerName && row.customerName.toLowerCase().includes(q)) ||
      (row.supplierName && row.supplierName.toLowerCase().includes(q))
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
            {k.id === "low_stock" && lowStockItems.length > 0 && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>
                {lowStockItems.length} items
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
                : <React.Fragment>
                <span className={`badge ${k.trendDir}`}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "0.625rem",
                    }}>
                    {k.trendDir === "up" ? "arrow_upward" : "arrow_downward"}
                  </span>
                  {k.trend}
                </span>
                <span>
                  {k.note}
                </span>
              </React.Fragment>}
            </div>
          </div>,
        )}
      </div>
      <div className="charts-grid">
        <div className="card chart-card">
          <div className="chart-card-header">
            <h3>
              Orders Over Time
            </h3>
            <select
              className="form-input"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                width: "auto",
                padding: "0.25rem 2rem 0.25rem 0.5rem",
                fontSize: "0.75rem",
              }}>
              <option value="Last 30 Days">
                Last 30 Days
              </option>
              <option value="This Quarter">
                This Quarter
              </option>
              <option value="This Year">
                This Year
              </option>
            </select>
          </div>
          <div
            className="chart-area"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "0.25rem",
              paddingTop: "1rem",
            }}>
            {currentChart.data.map((h, i) =>
              <div
                key={i}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background:
                    hoveredBar === i
                      ? "linear-gradient(180deg, var(--primary) 0%, var(--primary-container) 100%)"
                      : i === currentChart.peakIndex
                        ? "linear-gradient(180deg, var(--primary) 0%, var(--primary-container) 100%)"
                        : "var(--primary-fixed)",
                  borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                  transition: "height 0.6s ease, background 0.2s ease",
                  position: "relative",
                  cursor: "pointer",
                }}>
                {hoveredBar === i && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-2rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--inverse-surface)",
                      color: "var(--inverse-on-surface)",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      zIndex: 10,
                    }}>
                    {currentChart.orders[i]} orders
                  </div>
                )}
              </div>,
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.75rem",
              fontSize: "0.625rem",
              color: "var(--outline)",
            }}>
            {currentChart.labels.map((lbl, i) => (
              <span key={i}>{lbl}</span>
            ))}
          </div>
        </div>
        <div className="card chart-card">
          <div className="chart-card-header">
            <h3>
              Inventory Distribution
            </h3>
            <button
              className="btn-ghost"
              style={{
                padding: "0.25rem",
              }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "1rem",
                }}>
                more_vert
              </span>
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              paddingTop: "0.5rem",
            }}>
            {inventoryDist.map((item, i) =>
              <div className="h-bar-group" key={i}>
                <div className="h-bar-label">
                  <span>
                    {item.label}
                  </span>
                  <span>
                    {item.pct}
                    %
                  </span>
                </div>
                <div className="h-bar-track">
                  <div
                    className="h-bar-fill"
                    style={{
                      width: `${item.pct}%`,
                      opacity: 1 - i * 0.2,
                    }} />
                </div>
              </div>,
            )}
          </div>
          <div className="divider" />
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--on-surface-variant)",
              textAlign: "center",
            }}>
            {"Total Value: "}
            <span
              style={{
                fontWeight: 600,
                color: "var(--on-surface)",
              }}>
              $2.4M
            </span>
          </p>
        </div>
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
                <th>Supplier Name</th>
                <th>Items</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivity.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "1rem" }}>
                    No results found for "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredActivity.map((row, i) => (
                  <tr key={i}>
                    <td className="font-medium" style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>
                      {row.id}
                    </td>
                    <td className="font-medium">{row.customerName}</td>
                    <td>{row.supplierName}</td>
                    <td>{row.items ? row.items.map(it => it.name).join(", ") : "—"}</td>
                    <td>{row.items ? row.items.reduce((sum, it) => sum + it.quantity, 0) : 0}</td>
                    <td className="font-medium">{formatCurrency(row.totalAmount)}</td>
                    <td>{formatDate(row.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${statusClass(row.orderStatus)}`}>
                        {row.orderStatus}
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
