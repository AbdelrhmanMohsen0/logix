import React, { useState, useEffect } from 'react';
import { WarehouseAPI } from '../../services/api';

function PickingAssignmentsPage({ listId, onNavigate }) {
  const [order, setOrder] = useState(null);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [packing, setPacking] = useState(false);

  useEffect(() => {
    // Attempt to load from sessionStorage
    const cached = sessionStorage.getItem("active_picking_" + listId);
    if (cached) {
      setOrder(JSON.parse(cached));
      setLoading(false);
    } else {
      // Try to acquire lock directly (fallback)
      WarehouseAPI.startPicking(listId)
        .then(data => {
          setOrder(data);
          sessionStorage.setItem("active_picking_" + listId, JSON.stringify(data));
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          if (err.response?.status === 423) {
            setError("Access Denied: This order is currently locked and being processed by another worker.");
          } else {
            setError("Failed to load order: " + err.message);
          }
          setLoading(false);
        });
    }
  }, [listId]);

  const toggleCheck = (sku) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(sku)) {
      newSet.delete(sku);
    } else {
      newSet.add(sku);
    }
    setCheckedItems(newSet);
  };

  const handlePack = async () => {
    if (!order) return;
    setPacking(true);
    try {
      await WarehouseAPI.packOrder(listId);
      sessionStorage.removeItem("active_picking_" + listId);
      onNavigate("picking-lists");
    } catch (err) {
      alert("Failed to mark as packed: " + err.message);
      setPacking(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="page-header" style={{ marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--error)" }}>Access Denied</h2>
            <p>{error}</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary" onClick={() => onNavigate("picking-lists")}>
              Back to Picking Lists
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const orderIdText = order.orderDisplayIndex || order.orderId;
  const allChecked = order.items?.length > 0 && checkedItems.size === order.items.length;

  // Group items by broad location (e.g., aisle "12" from "12-B-04")
  const groupedItems = {};
  (order.items || []).forEach(item => {
    const aisle = item.location ? item.location.split("-")[0] : "UNKNOWN";
    if (!groupedItems[aisle]) groupedItems[aisle] = [];
    groupedItems[aisle].push(item);
  });

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "2.5rem" }}>
        <div>
          <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Picking Assignment</span>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "900", marginTop: "0.25rem" }}>
            Order {orderIdText}
          </h2>
        </div>
      </div>

      <div style={{ paddingBottom: "6rem" }}>
        {Object.entries(groupedItems).map(([aisle, items]) => (
          <div key={aisle} style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "0.8125rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--on-surface-variant)", marginBottom: "1rem" }}>
              AISLE {aisle}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map(item => {
                const isChecked = checkedItems.has(item.sku);
                return (
                  <div key={item.sku} className="card" style={{ 
                    padding: "1.5rem", 
                    display: "flex", 
                    alignItems: "flex-start", 
                    gap: "1.5rem",
                    border: isChecked ? "2px solid var(--primary)" : "2px solid transparent",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ paddingTop: "0.25rem" }}>
                      <div 
                        onClick={() => toggleCheck(item.sku)}
                        style={{
                          width: "24px", height: "24px", borderRadius: "4px",
                          border: isChecked ? "none" : "2px solid var(--outline)",
                          background: isChecked ? "var(--primary)" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all 0.2s"
                        }}>
                        {isChecked && <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "16px", fontWeight: "bold" }}>check</span>}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", fontWeight: 600, marginBottom: "0.25rem" }}>
                            SKU: {item.sku}
                          </div>
                          <div style={{ fontSize: "1.125rem", fontWeight: 700, color: isChecked ? "var(--on-surface-variant)" : "var(--on-surface)", textDecoration: isChecked ? "line-through" : "none" }}>
                            {item.name}
                          </div>
                        </div>
                        {item.location && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--primary-container)", color: "var(--on-primary-container)", padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>location_on</span>
                            <div>
                              <div style={{ fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.05em", opacity: 0.8 }}>LOCATION</div>
                              <div style={{ fontSize: "0.875rem", fontWeight: 700 }}>{item.location}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: "1.5rem" }}>
                        <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.05em", color: "var(--on-surface-variant)", marginBottom: "0.25rem" }}>
                          QUANTITY
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                          <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>{item.quantity}</span>
                          <span style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>units</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position: "sticky",
        bottom: 0,
        background: "var(--surface)",
        padding: "1.5rem",
        borderTop: "1px solid var(--outline-variant)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
        zIndex: 100,
        margin: "0 -1.5rem -1.5rem -1.5rem"
      }}>
        <button className="btn btn-secondary" onClick={() => onNavigate("picking-lists")}>
          Back to List
        </button>
        <button 
          className="btn btn-primary" 
          disabled={!allChecked || packing}
          onClick={handlePack}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", fontSize: "1rem", opacity: (!allChecked || packing) ? 0.5 : 1 }}>
          <span className="material-symbols-outlined">
            check_circle
          </span>
          {packing ? "Packing..." : "Mark as Packed"}
        </button>
      </div>
    </div>
  );
}

export default PickingAssignmentsPage;
