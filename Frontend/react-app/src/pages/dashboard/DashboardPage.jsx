import React from 'react';
import { useAuth } from '../../context/AuthContext';

function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
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
      label: "Low Stock Alerts",
      value: "18",
      icon: "warning",
      iconClass: "error",
      valueClass: "error-text",
      action: "Review items →",
    },
  ];
  const recentActivity = [
    {
      id: "#TRK-89241",
      status: "Delivered",
      statusClass: "delivered",
      dest: "New York, NY",
      date: "Oct 24, 14:30",
    },
    {
      id: "#TRK-89240",
      status: "In Transit",
      statusClass: "in-transit",
      dest: "Chicago, IL",
      date: "Oct 24, 09:15",
    },
    {
      id: "#TRK-89239",
      status: "Delayed",
      statusClass: "delayed",
      dest: "Austin, TX",
      date: "Oct 23, 16:45",
    },
    {
      id: "#TRK-89238",
      status: "Processing",
      statusClass: "processing",
      dest: "Seattle, WA",
      date: "Oct 23, 11:20",
    },
  ];
  const inventoryDist = [
    {
      label: "Electronics",
      pct: 45,
    },
    {
      label: "Apparel",
      pct: 30,
    },
    {
      label: "Home Goods",
      pct: 15,
    },
    {
      label: "Other",
      pct: 10,
    },
  ];
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
            <div className="kpi-trend">
              {k.action
                ? <a
                href="#"
                onClick={(e) => e.preventDefault()}
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
              style={{
                width: "auto",
                padding: "0.25rem 2rem 0.25rem 0.5rem",
                fontSize: "0.75rem",
              }}>
              <option>
                Last 30 Days
              </option>
              <option>
                This Quarter
              </option>
              <option>
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
            {[65, 45, 72, 58, 90, 78, 55, 82, 95, 68, 74, 88].map((h, i) =>
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background:
                    i === 8
                      ? "linear-gradient(180deg, var(--primary) 0%, var(--primary-container) 100%)"
                      : "var(--primary-fixed)",
                  borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                  transition: "height 0.6s ease",
                  position: "relative",
                }}
                title={`Week ${i + 1}: ${Math.round(h * 5)} orders`}>
                {i === 8 &&
                  <div
                    style={{
                      position: "absolute",
                      top: "-1.75rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--inverse-surface)",
                      color: "var(--inverse-on-surface)",
                      fontSize: "0.625rem",
                      padding: "0.125rem 0.375rem",
                      borderRadius: "var(--radius-sm)",
                      whiteSpace: "nowrap",
                    }}>
                    Peak: 475
                  </div>}
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
            <span>
              Week 1
            </span>
            <span>
              Week 4
            </span>
            <span>
              Week 8
            </span>
            <span>
              Week 12
            </span>
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
                <th>
                  Tracking ID
                </th>
                <th>
                  Status
                </th>
                <th>
                  Destination
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
              {recentActivity.map((row, i) =>
                <tr key={i}>
                  <td className="font-medium">
                    {row.id}
                  </td>
                  <td>
                    <span className={`status-badge ${row.statusClass}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {row.dest}
                  </td>
                  <td>
                    {row.date}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                    }}>
                    <button
                      className="btn-ghost"
                      style={{
                        padding: "0.25rem",
                      }}>
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
      </div>
    </div>
  );
}

export default DashboardPage;
