function WarehouseZoneManagementPage({ onNavigate }) {
  const h = React.createElement;
  const [zones] = React.useState([
    { name: "Zone A - Electronics", capacity: 80, utilization: 65 },
    { name: "Zone B - Stationery", capacity: 100, utilization: 90 },
    { name: "Zone C - General", capacity: 200, utilization: 20 },
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
        h("h2", null, "Zone Management"),
        h("p", null, "Configure warehouse geographic zones and limits."),
      ),
      h(
        "button",
        {
          className: "btn btn-secondary btn-sm",
          onClick: () => onNavigate("warehouse-operations"),
        },
        "Back to Operations",
      ),
    ),
    h(
      "div",
      {
        className: "card",
        style: { padding: "1.5rem", marginBottom: "1.5rem" },
      },
      h(
        "div",
        { style: { display: "grid", gap: "1rem" } },
        zones.map((z, idx) =>
          h(
            "div",
            {
              key: idx,
              style: {
                border: "1px solid var(--surface-container)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
              },
            },
            h(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                },
              },
              h("h4", null, z.name),
              h(
                "span",
                { className: "status-badge default" },
                `Cap: ${z.capacity} units`,
              ),
            ),
            h(
              "div",
              { className: "h-bar-track" },
              h("div", {
                className: "h-bar-fill",
                style: {
                  width: `${z.utilization}%`,
                  background:
                    z.utilization > 85 ? "var(--error)" : "var(--primary)",
                },
              }),
            ),
            h(
              "div",
              {
                style: {
                  marginTop: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--on-surface-variant)",
                },
              },
              `${z.utilization}% Utilized`,
            ),
          ),
        ),
      ),
    ),
    h(
      "button",
      {
        className: "btn btn-primary",
        onClick: () => alert("Mock: Add New Zone"),
      },
      "Add New Zone",
    ),
  );
}
