function PickingListManagementPage({ onNavigate }) {
  const h = React.createElement;
  return h(
    "div",
    null,
    h(
      "div",
      { className: "page-header" },
      h(
        "div",
        null,
        h("h2", null, "Picking Management Dashboard"),
        h("p", null, "Advanced picking assignment and statistics."),
      ),
      h(
        "div",
        { className: "page-actions" },
        h(
          "button",
          {
            className: "btn btn-secondary btn-sm",
            onClick: () => onNavigate("picking-lists"),
          },
          "Back to Lists",
        ),
      ),
    ),
    h(
      "div",
      { className: "kpi-grid" },
      h(
        "div",
        { className: "card kpi-card" },
        h("div", { className: "kpi-label" }, "Pending Picks"),
        h("div", { className: "kpi-value" }, "42"),
      ),
      h(
        "div",
        { className: "card kpi-card" },
        h("div", { className: "kpi-label" }, "Active Pickers"),
        h("div", { className: "kpi-value" }, "8"),
      ),
      h(
        "div",
        { className: "card kpi-card" },
        h("div", { className: "kpi-label" }, "Completed Today"),
        h(
          "div",
          { className: "kpi-value", style: { color: "var(--success)" } },
          "124",
        ),
      ),
    ),
    h(
      "div",
      { className: "card", style: { padding: "1.5rem" } },
      h("h3", { style: { marginBottom: "1rem" } }, "Picker Workloads"),
      h(
        "p",
        { style: { color: "var(--on-surface-variant)" } },
        "Mock Data: Picker assignment and load visualization will render here once warehouse-service is deployed.",
      ),
    ),
  );
}
