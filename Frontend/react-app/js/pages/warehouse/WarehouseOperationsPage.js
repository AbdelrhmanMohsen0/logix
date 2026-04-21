function WarehouseOperationsPage({ onNavigate }) {
  const h = React.createElement;
  return h(
    "div",
    null,
    h(
      "div",
      { className: "page-header", style: { marginBottom: "2.5rem" } },
      h(
        "div",
        null,
        h(
          "h2",
          { style: { fontSize: "2.25rem", fontWeight: "800" } },
          "Warehouse Operations",
        ),
        h(
          "p",
          { style: { fontSize: "1.125rem" } },
          "Select a module to manage kinetic workflow.",
        ),
      ),
    ),
    h(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
        },
      },
      h(
        "div",
        {
          className: "card module-card",
          onClick: () => onNavigate("inbound-shipments"),
        },
        h(
          "div",
          { className: "icon-container" },
          h("span", { className: "material-symbols-outlined" }, "input"),
        ),
        h(
          "h3",
          { style: { fontSize: "1.5rem", fontWeight: "700" } },
          "Inbound",
        ),
        h("p", null, "Receive and stock items"),
      ),
      h(
        "div",
        {
          className: "card module-card",
          onClick: () => onNavigate("picking-lists"),
        },
        h(
          "div",
          { className: "icon-container" },
          h(
            "span",
            { className: "material-symbols-outlined" },
            "shopping_basket",
          ),
        ),
        h(
          "h3",
          { style: { fontSize: "1.5rem", fontWeight: "700" } },
          "Picking & Packing",
        ),
        h("p", null, "Fulfill customer orders"),
      ),
      h(
        "div",
        {
          className: "card module-card",
          onClick: () => onNavigate("shipments"),
        },
        h(
          "div",
          { className: "icon-container" },
          h("span", { className: "material-symbols-outlined" }, "package_2"),
        ),
        h(
          "h3",
          { style: { fontSize: "1.5rem", fontWeight: "700" } },
          "Shipments",
        ),
        h("p", null, "Ship customer orders"),
      ),
    ),
  );
}
