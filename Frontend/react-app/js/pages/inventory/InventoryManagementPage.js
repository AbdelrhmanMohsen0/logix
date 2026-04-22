function InventoryManagementPage({ onNavigate }) {
  const h = React.createElement;
  const [items, setItems] = React.useState([
    {
      sku: "ELEC-001",
      name: "Wireless Keyboard",
      qty: 154,
      loc: "Zone A - A12",
      updated: "2025-10-25",
    },
    {
      sku: "OFF-010",
      name: "Ergonomic Chair",
      qty: 28,
      loc: "Zone C - C04",
      updated: "2025-10-24",
    },
    {
      sku: "STAT-005",
      name: "Notebook Bundle",
      qty: 450,
      loc: "Zone B - B02",
      updated: "2025-10-25",
    },
  ]);
  return h(
    "div",
    null,
    h(
      "div",
      { className: "page-header" },
      h(
        "div",
        null,
        h("h2", null, "Inventory Management"),
        h("p", null, "View and adjust current stock levels across all zones."),
      ),
      h(
        "div",
        { className: "page-actions" },
        h(
          "button",
          {
            className: "btn btn-secondary btn-sm",
            onClick: () => alert("Mock: Adjust Stock"),
          },
          h(
            "span",
            {
              className: "material-symbols-outlined",
              style: { fontSize: "1rem" },
            },
            "settings",
          ),
          "Adjust Stock",
        ),
        h(
          "button",
          {
            className: "btn btn-primary btn-sm",
            onClick: () => alert("Mock: Add Stock"),
          },
          h(
            "span",
            {
              className: "material-symbols-outlined",
              style: { fontSize: "1rem" },
            },
            "add",
          ),
          "Add Stock",
        ),
      ),
    ),
    h(
      "div",
      { className: "alert alert-info", style: { marginBottom: "1.5rem" } },
      h(
        "span",
        { className: "material-symbols-outlined", style: { fontSize: "1rem" } },
        "info",
      ),
      "Inventory data is simulated. Backend GET /inventory endpoint is not yet implemented.",
    ),
    h(
      "div",
      { className: "card", style: { padding: "0.5rem 0" } },
      h(
        "div",
        { className: "table-wrapper" },
        h(
          "table",
          null,
          h(
            "thead",
            null,
            h(
              "tr",
              null,
              h("th", null, "SKU"),
              h("th", null, "Product Name"),
              h("th", null, "Quantity"),
              h("th", null, "Location"),
              h("th", null, "Last Updated"),
              h("th", { style: { textAlign: "right" } }, "Actions"),
            ),
          ),
          h(
            "tbody",
            null,
            items.map((i, idx) =>
              h(
                "tr",
                { key: idx },
                h(
                  "td",
                  {
                    className: "font-medium",
                    style: { fontFamily: "monospace", fontSize: "0.8125rem" },
                  },
                  i.sku,
                ),
                h("td", { className: "font-medium" }, i.name),
                h(
                  "td",
                  null,
                  i.qty > 50
                    ? h("span", { className: "status-badge success" }, i.qty)
                    : h("span", { className: "status-badge delayed" }, i.qty),
                ),
                h("td", null, i.loc),
                h("td", null, i.updated),
                h(
                  "td",
                  { style: { textAlign: "right" } },
                  h(
                    "button",
                    { className: "btn-ghost", title: "Edit details" },
                    h(
                      "span",
                      {
                        className: "material-symbols-outlined",
                        style: { fontSize: "1.125rem" },
                      },
                      "edit",
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
