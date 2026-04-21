function InboundShipmentsPage({ onNavigate }) {
  const h = React.createElement;
  const [shipments] = React.useState([
    {
      id: "#SHP-1024",
      supplier: "Global Logistics Inc.",
      date: "Oct 24, 2023",
      items: "1,240",
    },
    {
      id: "#SHP-1025",
      supplier: "Nordic Supply Chain",
      date: "Oct 25, 2023",
      items: "850",
    },
    {
      id: "#SHP-1026",
      supplier: "Apex Manufacturing",
      date: "Oct 26, 2023",
      items: "425",
    },
    {
      id: "#SHP-1027",
      supplier: "Prime Electronics",
      date: "Oct 26, 2023",
      items: "3,110",
    },
    {
      id: "#SHP-1028",
      supplier: "Velocity Freight",
      date: "Oct 27, 2023",
      items: "2,480",
    },
    {
      id: "#SHP-1029",
      supplier: "Continental Spares",
      date: "Oct 28, 2023",
      items: "760",
    },
  ]);
  return h(
    "div",
    null,
    h(
      "div",
      { className: "page-header", style: { marginBottom: "2rem" } },
      h(
        "div",
        null,
        h(
          "h2",
          { style: { fontSize: "2.25rem", fontWeight: "800" } },
          "Inbound",
        ),
        h(
          "p",
          { style: { fontSize: "1.125rem" } },
          "Manage and track all incoming shipments, verify quantities, and assign storage locations within the facility.",
        ),
      ),
      h(
        "div",
        { className: "page-actions" },
        h(
          "button",
          {
            className: "btn btn-primary",
            style: { padding: "0.625rem 1.25rem" },
            onClick: () => onNavigate("add-received-shipment"),
          },
          h(
            "span",
            {
              className: "material-symbols-outlined",
              style: { marginRight: "0.5rem", fontSize: "1.25rem" },
            },
            "add",
          ),
          "Add New Received Shipment",
        ),
      ),
    ),
    h(
      "div",
      { className: "card", style: { padding: "0" } },
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
              h("th", null, "SHIPMENT ID"),
              h("th", null, "SUPPLIER"),
              h("th", null, "RECEIVING DATE"),
              h("th", null, "NUMBER OF ITEMS RECEIVED"),
            ),
          ),
          h(
            "tbody",
            null,
            shipments.map((s, idx) =>
              h(
                "tr",
                { key: idx },
                h(
                  "td",
                  {
                    className: "font-medium",
                    style: { color: "var(--on-surface)", fontWeight: "700" },
                  },
                  s.id,
                ),
                h("td", null, s.supplier),
                h("td", null, s.date),
                h("td", { style: { fontWeight: "600" } }, s.items),
              ),
            ),
          ),
        ),
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--surface-container)",
          },
        },
        h(
          "div",
          {
            style: { fontSize: "0.75rem", color: "var(--on-surface-variant)" },
          },
          "Showing 1 to 6 of 128 entries",
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              gap: "1rem",
              fontSize: "0.8125rem",
              fontWeight: "600",
              color: "var(--on-surface)",
            },
          },
          h(
            "span",
            { style: { color: "var(--outline-variant)", cursor: "pointer" } },
            "<",
          ),
          h("span", { style: { cursor: "pointer" } }, "1"),
          h("span", { style: { cursor: "pointer" } }, "2"),
          h("span", { style: { cursor: "pointer" } }, "3"),
          h("span", { style: { color: "var(--outline-variant)" } }, "..."),
          h(
            "span",
            { style: { color: "var(--outline-variant)", cursor: "pointer" } },
            ">",
          ),
        ),
      ),
    ),
  );
}
