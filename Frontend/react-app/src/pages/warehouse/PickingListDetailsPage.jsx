import React from 'react';
import { OrderAPI } from '../../services/api';

function PickingListDetailsPage({ listId, onNavigate }) {
  
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setLoading(true);
    OrderAPI.getOrder(listId)
      .then(order => {
        setItems(order.items.map(it => ({
          sku: it.SKU,
          name: it.name,
          qty: it.quantity,
          loc: "Zone A - Bin 1", // Mock location
          picked: false
        })));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [listId]);

  const allPicked = items.length > 0 && items.every((i) => i.picked);
  
  const togglePicked = (idx) => {
    const newItems = [...items];
    newItems[idx].picked = !newItems[idx].picked;
    setItems(newItems);
  };
  
  const handleComplete = async () => {
    try {
      await OrderAPI.updateOrderStatus(listId, "PACKED");
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
          <h2>
            {`Picking List Details: ${listId || "N/A"}`}
          </h2>
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
        <div style={{ marginTop: "2rem", textAlign: "right" }}>
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
