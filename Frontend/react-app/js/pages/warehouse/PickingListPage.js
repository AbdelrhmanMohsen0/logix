function PickingListPage({ onNavigate }) {
  const h = React.createElement;
  const [lists] = React.useState([
    {
      id: "PICK-101",
      order: "ORD-5521",
      status: "PENDING",
      picker: "Unassigned",
      items: 5,
      priority: "HIGH",
    },
    {
      id: "PICK-102",
      order: "ORD-5522",
      status: "IN-PROGRESS",
      picker: "M. Chen",
      items: 12,
      priority: "NORMAL",
    },
    {
      id: "PICK-103",
      order: "ORD-5519",
      status: "COMPLETED",
      picker: "T. Kim",
      items: 2,
      priority: "NORMAL",
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
        h("h2", null, "Picking Lists"),
        h("p", null, "Manage and track order fulfillment picking operations."),
      ),
      h(
        "div",
        { className: "page-actions" },
        h(
          "button",
          {
            className: "btn btn-secondary btn-sm",
            onClick: () => onNavigate("picking-management"),
          },
          h(
            "span",
            {
              className: "material-symbols-outlined",
              style: { fontSize: "1rem" },
            },
            "settings",
          ),
          "Management Dashboard",
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
              h("th", null, "Pick List ID"),
              h("th", null, "Order ID"),
              h("th", null, "Status"),
              h("th", null, "Picker"),
              h("th", null, "Items"),
              h("th", { style: { textAlign: "right" } }, "Actions"),
            ),
          ),
          h(
            "tbody",
            null,
            lists.map((l, idx) =>
              h(
                "tr",
                { key: idx },
                h(
                  "td",
                  {
                    className: "font-medium",
                    style: { fontFamily: "monospace" },
                  },
                  l.id,
                ),
                h("td", null, l.order),
                h(
                  "td",
                  null,
                  h(
                    "span",
                    { className: `status-badge ${l.status.toLowerCase()}` },
                    l.status,
                  ),
                ),
                h("td", null, l.picker),
                h("td", null, l.items),
                h(
                  "td",
                  { style: { textAlign: "right" } },
                  h(
                    "button",
                    {
                      className: "btn-ghost",
                      onClick: () => onNavigate("picking-details:" + l.id),
                      title: "View / Start Picking",
                    },
                    h(
                      "span",
                      {
                        className: "material-symbols-outlined",
                        style: { fontSize: "1.125rem" },
                      },
                      "checklist",
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
