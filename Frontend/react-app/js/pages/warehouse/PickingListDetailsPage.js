function PickingListDetailsPage({ listId, onNavigate }) {
  const h = React.createElement;
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
  return h(
    "div",
    null,
    h(
      "div",
      { className: "page-header" },
      h(
        "div",
        null,
        h("h2", null, `Picking List Details: ${listId || "N/A"}`),
        h("p", null, "Mark items as picked as you fulfill the order."),
      ),
      h(
        "button",
        {
          className: "btn btn-secondary btn-sm",
          onClick: () => onNavigate("picking-lists"),
        },
        "Back",
      ),
    ),
    h(
      "div",
      { className: "card", style: { padding: "1.5rem" } },
      h("h3", { style: { marginBottom: "1rem" } }, "Items to Pick"),
      items.map((item, idx) =>
        h(
          "div",
          {
            key: idx,
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              borderBottom: "1px solid var(--surface-container)",
              background: item.picked ? "var(--success-bg)" : "transparent",
            },
          },
          h(
            "div",
            null,
            h("div", { style: { fontWeight: "600" } }, item.name),
            h(
              "div",
              { style: { fontSize: "0.8125rem", color: "var(--outline)" } },
              `SKU: ${item.sku} | Loc: ${item.loc}`,
            ),
          ),
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "1.5rem" } },
            h(
              "div",
              { style: { fontWeight: "700", fontSize: "1.25rem" } },
              `x${item.qty}`,
            ),
            h("input", {
              type: "checkbox",
              style: { transform: "scale(1.5)", cursor: "pointer" },
              checked: item.picked,
              onChange: () => togglePicked(idx),
            }),
          ),
        ),
      ),
      h(
        "div",
        { style: { marginTop: "2rem", textAlign: "right" } },
        h(
          "button",
          {
            className: "btn btn-primary",
            disabled: !allPicked,
            onClick: handleComplete,
          },
          "Complete Picking",
        ),
      ),
    ),
  );
}
