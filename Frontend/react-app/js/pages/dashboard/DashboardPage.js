function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const kpis = [
    {
      label: "Total Orders",
      value: "12,485",
      icon: "shopping_cart",
      iconClass: "primary",
      trend: "+14%",
      trendDir: "up",
      note: "vs last month",
      active: true,
    },
    {
      label: "Pending Shipments",
      value: "842",
      icon: "local_shipping",
      iconClass: "secondary",
      trend: "-3%",
      trendDir: "down",
      note: "vs last month",
    },
    {
      label: "Inventory Levels",
      value: "94.2%",
      icon: "inventory_2",
      iconClass: "secondary",
      trend: "0%",
      trendDir: "up",
      note: "stable",
    },
    {
      label: "Low Stock Alerts",
      value: "18",
      icon: "warning",
      iconClass: "error",
      valueClass: "error-text",
      action: "Review items →",
    },
  ];
  const recentActivity = [
    {
      id: "#TRK-89241",
      status: "Delivered",
      statusClass: "delivered",
      dest: "New York, NY",
      date: "Oct 24, 14:30",
    },
    {
      id: "#TRK-89240",
      status: "In Transit",
      statusClass: "in-transit",
      dest: "Chicago, IL",
      date: "Oct 24, 09:15",
    },
    {
      id: "#TRK-89239",
      status: "Delayed",
      statusClass: "delayed",
      dest: "Austin, TX",
      date: "Oct 23, 16:45",
    },
    {
      id: "#TRK-89238",
      status: "Processing",
      statusClass: "processing",
      dest: "Seattle, WA",
      date: "Oct 23, 11:20",
    },
  ];
  const inventoryDist = [
    {
      label: "Electronics",
      pct: 45,
    },
    {
      label: "Apparel",
      pct: 30,
    },
    {
      label: "Home Goods",
      pct: 15,
    },
    {
      label: "Other",
      pct: 10,
    },
  ];
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      {
        className: "page-header",
      },
      React.createElement(
        "div",
        null,
        React.createElement("h2", null, "Overview"),
        React.createElement(
          "p",
          null,
          "Monitor your logistics performance and critical alerts.",
        ),
      ),
      React.createElement(
        "div",
        {
          className: "page-actions",
        },
        React.createElement(
          "button",
          {
            className: "btn btn-secondary btn-sm",
            onClick: () => onNavigate("inventory"),
          },
          React.createElement(
            "span",
            {
              className: "material-symbols-outlined",
              style: {
                fontSize: "1rem",
              },
            },
            "add",
          ),
          "Add Product",
        ),
        React.createElement(
          "button",
          {
            className: "btn btn-primary btn-sm",
            onClick: () => onNavigate("create-order"),
          },
          React.createElement(
            "span",
            {
              className: "material-symbols-outlined",
              style: {
                fontSize: "1rem",
              },
            },
            "bolt",
          ),
          "Create Order",
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "kpi-grid",
      },
      kpis.map((k, i) =>
        React.createElement(
          "div",
          {
            className: `card kpi-card${k.active ? " active" : ""}`,
            key: i,
          },
          React.createElement(
            "div",
            {
              className: "kpi-card-header",
            },
            React.createElement(
              "span",
              {
                className: "kpi-label",
              },
              k.label,
            ),
            React.createElement(
              "div",
              {
                className: `kpi-icon ${k.iconClass}`,
              },
              React.createElement(
                "span",
                {
                  className: "material-symbols-outlined",
                },
                k.icon,
              ),
            ),
          ),
          React.createElement(
            "div",
            {
              className: `kpi-value${k.valueClass ? " " + k.valueClass : ""}`,
            },
            k.value,
          ),
          React.createElement(
            "div",
            {
              className: "kpi-trend",
            },
            k.action
              ? React.createElement(
                  "a",
                  {
                    href: "#",
                    onClick: (e) => e.preventDefault(),
                    style: {
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    },
                  },
                  k.action,
                )
              : React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "span",
                    {
                      className: `badge ${k.trendDir}`,
                    },
                    React.createElement(
                      "span",
                      {
                        className: "material-symbols-outlined",
                        style: {
                          fontSize: "0.625rem",
                        },
                      },
                      k.trendDir === "up" ? "arrow_upward" : "arrow_downward",
                    ),
                    k.trend,
                  ),
                  React.createElement("span", null, k.note),
                ),
          ),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "charts-grid",
      },
      React.createElement(
        "div",
        {
          className: "card chart-card",
        },
        React.createElement(
          "div",
          {
            className: "chart-card-header",
          },
          React.createElement("h3", null, "Orders Over Time"),
          React.createElement(
            "select",
            {
              className: "form-input",
              style: {
                width: "auto",
                padding: "0.25rem 2rem 0.25rem 0.5rem",
                fontSize: "0.75rem",
              },
            },
            React.createElement("option", null, "Last 30 Days"),
            React.createElement("option", null, "This Quarter"),
            React.createElement("option", null, "This Year"),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "chart-area",
            style: {
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "0.25rem",
              paddingTop: "1rem",
            },
          },
          [65, 45, 72, 58, 90, 78, 55, 82, 95, 68, 74, 88].map((h, i) =>
            React.createElement(
              "div",
              {
                key: i,
                style: {
                  flex: 1,
                  height: `${h}%`,
                  background:
                    i === 8
                      ? "linear-gradient(180deg, var(--primary) 0%, var(--primary-container) 100%)"
                      : "var(--primary-fixed)",
                  borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                  transition: "height 0.6s ease",
                  position: "relative",
                },
                title: `Week ${i + 1}: ${Math.round(h * 5)} orders`,
              },
              i === 8 &&
                React.createElement(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      top: "-1.75rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--inverse-surface)",
                      color: "var(--inverse-on-surface)",
                      fontSize: "0.625rem",
                      padding: "0.125rem 0.375rem",
                      borderRadius: "var(--radius-sm)",
                      whiteSpace: "nowrap",
                    },
                  },
                  "Peak: 475",
                ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.75rem",
              fontSize: "0.625rem",
              color: "var(--outline)",
            },
          },
          React.createElement("span", null, "Week 1"),
          React.createElement("span", null, "Week 4"),
          React.createElement("span", null, "Week 8"),
          React.createElement("span", null, "Week 12"),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "card chart-card",
        },
        React.createElement(
          "div",
          {
            className: "chart-card-header",
          },
          React.createElement("h3", null, "Inventory Distribution"),
          React.createElement(
            "button",
            {
              className: "btn-ghost",
              style: {
                padding: "0.25rem",
              },
            },
            React.createElement(
              "span",
              {
                className: "material-symbols-outlined",
                style: {
                  fontSize: "1rem",
                },
              },
              "more_vert",
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              paddingTop: "0.5rem",
            },
          },
          inventoryDist.map((item, i) =>
            React.createElement(
              "div",
              {
                className: "h-bar-group",
                key: i,
              },
              React.createElement(
                "div",
                {
                  className: "h-bar-label",
                },
                React.createElement("span", null, item.label),
                React.createElement("span", null, item.pct, "%"),
              ),
              React.createElement(
                "div",
                {
                  className: "h-bar-track",
                },
                React.createElement("div", {
                  className: "h-bar-fill",
                  style: {
                    width: `${item.pct}%`,
                    opacity: 1 - i * 0.2,
                  },
                }),
              ),
            ),
          ),
        ),
        React.createElement("div", {
          className: "divider",
        }),
        React.createElement(
          "p",
          {
            style: {
              fontSize: "0.75rem",
              color: "var(--on-surface-variant)",
              textAlign: "center",
            },
          },
          "Total Value: ",
          React.createElement(
            "span",
            {
              style: {
                fontWeight: 600,
                color: "var(--on-surface)",
              },
            },
            "$2.4M",
          ),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "card",
        style: {
          padding: "1.5rem",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          },
        },
        React.createElement("h3", null, "Recent Activity"),
        React.createElement(
          "a",
          {
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              onNavigate("orders");
            },
            style: {
              fontSize: "0.875rem",
              fontWeight: 500,
            },
          },
          "View All",
        ),
      ),
      React.createElement(
        "div",
        {
          className: "table-wrapper",
        },
        React.createElement(
          "table",
          null,
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", null, "Tracking ID"),
              React.createElement("th", null, "Status"),
              React.createElement("th", null, "Destination"),
              React.createElement("th", null, "Date"),
              React.createElement(
                "th",
                {
                  style: {
                    textAlign: "right",
                  },
                },
                "Action",
              ),
            ),
          ),
          React.createElement(
            "tbody",
            null,
            recentActivity.map((row, i) =>
              React.createElement(
                "tr",
                {
                  key: i,
                },
                React.createElement(
                  "td",
                  {
                    className: "font-medium",
                  },
                  row.id,
                ),
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "span",
                    {
                      className: `status-badge ${row.statusClass}`,
                    },
                    row.status,
                  ),
                ),
                React.createElement("td", null, row.dest),
                React.createElement("td", null, row.date),
                React.createElement(
                  "td",
                  {
                    style: {
                      textAlign: "right",
                    },
                  },
                  React.createElement(
                    "button",
                    {
                      className: "btn-ghost",
                      style: {
                        padding: "0.25rem",
                      },
                    },
                    React.createElement(
                      "span",
                      {
                        className: "material-symbols-outlined",
                        style: {
                          fontSize: "1.125rem",
                        },
                      },
                      "visibility",
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
