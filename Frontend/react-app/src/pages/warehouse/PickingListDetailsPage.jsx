import React from 'react';
import { WarehouseAPI } from '../../services/api';

function PickingListDetailsPage({ listId, onNavigate }) {
  
  const [items, setItems] = React.useState([]);
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchOrder = React.useCallback(() => {
    setLoading(true);
    WarehouseAPI.startPicking(listId)
      .then(data => {
        setOrder(data);
        setItems(data.items.map(it => ({
          sku: it.sku,
          name: it.name,
          qty: it.quantity,
          loc: it.location,
          picked: false
        })));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [listId]);

  React.useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const allPicked = items.length > 0 && items.every((i) => i.picked);
  
  const togglePicked = (idx) => {
    if (order?.orderStatus === "PENDING") {
      alert("Please press 'Start Work' before picking items.");
      return;
    }
    const newItems = [...items];
    newItems[idx].picked = !newItems[idx].picked;
    setItems(newItems);
  };
  
  const handleCancelWork = async () => {
    if (!window.confirm("Are you sure you want to cancel picking? This order will be released to other workers.")) return;
    try {
      await WarehouseAPI.cancelPicking(listId);
      onNavigate("picking-lists");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleComplete = async () => {
    try {
      await WarehouseAPI.packOrder(listId);
      alert("Picking and Packing Completed! Status changed to PACKED.");
      onNavigate("picking-lists");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner spinner-lg"/></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <h2 style={{ margin: 0 }}>
              {`Picking List Details: ${listId || "N/A"}`}
            </h2>
            {order && (
              <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
            )}
          </div>
          <p>
            Mark items as picked as you fulfill the order.
          </p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigate("picking-lists")}>
          Back
        </button>
      </div>
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>
          Items to Pick
        </h3>
        {items.map((item, idx) =>
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              borderBottom: "1px solid var(--surface-container)",
              background: item.picked ? "var(--success-bg)" : "transparent",
            }}>
            <div>
              <div style={{ fontWeight: "600" }}>
                {item.name}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--outline)" }}>
                {`SKU: ${item.sku} | Loc: ${item.loc}`}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ fontWeight: "700", fontSize: "1.25rem" }}>
                {`x${item.qty}`}
              </div>
              <input
                type="checkbox"
                style={{ transform: "scale(1.5)", cursor: "pointer" }}
                checked={item.picked}
                onChange={() => togglePicked(idx)} />
            </div>
          </div>,
        )}
        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button
            className="btn btn-secondary"
            onClick={handleCancelWork}>
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              cancel
            </span>
            Cancel Picking
          </button>
          <button
            className="btn btn-primary"
            disabled={!allPicked}
            onClick={handleComplete}>
            Complete Picking
          </button>
        </div>
      </div>
    </div>
  );
}

export default PickingListDetailsPage;
