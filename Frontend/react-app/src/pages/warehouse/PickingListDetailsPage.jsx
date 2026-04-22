import React from 'react';

function PickingListDetailsPage({ listId, onNavigate }) {
  
  const [items, setItems] = React.useState([
    {
      sku: "STAT-005",
      name: "Notebook Bundle",
      qty: 2,
      picked: false,
      loc: "Zone B - B02",
    },
    {
      sku: "ELEC-001",
      name: "Wireless Keyboard",
      qty: 1,
      picked: false,
      loc: "Zone A - A12",
    },
  ]);
  const allPicked = items.every((i) => i.picked);
  const togglePicked = (idx) => {
    const newItems = [...items];
    newItems[idx].picked = !newItems[idx].picked;
    setItems(newItems);
  };
  const handleComplete = () => {
    alert("Picking List Completed!");
    onNavigate("picking-lists");
  };
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
