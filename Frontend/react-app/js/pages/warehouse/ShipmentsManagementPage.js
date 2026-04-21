function ShipmentsManagementPage({ onNavigate }) {
  const h = React.createElement;
  const [shipments, setShipments] = React.useState([
    {
      orderId: "#ORD-8821",
      customer: "James Wilson",
      address: "452 Industrial Way, Suite 10, Seattle, WA 98101",
    },
    {
      orderId: "#ORD-8822",
      customer: "Sarah Miller",
      address: "1209 East Maple Blvd, Austin, TX 78701",
    },
    {
      orderId: "#ORD-8823",
      customer: "Tech Corp Solutions",
      address: "88 Market Street, Floor 4, San Francisco, CA 94105",
    },
    {
      orderId: "#ORD-8824",
      customer: "Robert Chen",
      address: "2130 Ventura Blvd, Los Angeles, CA 90012",
    },
  ]);
  const markShipped = (idx) => {
    setShipments((s) => s.filter((_, i) => i !== idx));
  };
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
          "Shipments",
        ),
        h(
          "p",
          { style: { fontSize: "1.125rem" } },
          "Manage and track outgoing inventory shipments to customers.",
        ),
      ),
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
              h("th", null, "ORDER ID"),
              h("th", null, "CUSTOMER NAME"),
              h("th", null, "ADDRESS"),
              h("th", null, "ACTION"),
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
                    style: { color: "var(--primary)", fontWeight: "600" },
                  },
                  s.orderId,
                ),
                h("td", null, s.customer),
                h("td", null, s.address),
                h(
                  "td",
                  null,
                  h(
                    "button",
                    {
                      className: "btn btn-primary",
                      style: {
                        padding: "0.375rem 1rem",
                        fontSize: "0.8125rem",
                        borderRadius: "0.375rem",
                      },
                      onClick: () => markShipped(idx),
                    },
                    "Mark as Shipped",
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
