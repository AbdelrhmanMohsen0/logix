function OrderListPage({ onNavigate }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await OrderAPI.getOrders();
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const statusClass = (s) => (s || "").toLowerCase();
  const formatCurrency = (n) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n || 0);
  };
  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
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
        React.createElement("h2", null, "Orders"),
        React.createElement("p", null, "Manage and track all customer orders."),
      ),
      React.createElement(
        "div",
        {
          className: "page-actions",
        },
        React.createElement(
          "button",
          {
            className: "btn btn-primary btn-sm",
            onClick: () => onNavigate("create-order"),
            id: "btn-create-order",
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
          "Create Order",
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "alert alert-info",
        style: {
          marginBottom: "1.5rem",
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
        "info",
      ),
      "Order list uses simulated data. Backend GET /orders endpoint is not yet implemented.",
    ),
    error &&
      React.createElement(
        "div",
        {
          className: "alert alert-error",
        },
        React.createElement(
          "span",
          {
            className: "material-symbols-outlined",
            style: {
              fontSize: "1rem",
            },
          },
          "error",
        ),
        error,
      ),
    loading
      ? React.createElement(
          "div",
          {
            className: "loading-center",
          },
          React.createElement("div", {
            className: "spinner spinner-lg",
          }),
        )
      : orders.length === 0
        ? React.createElement(
            "div",
            {
              className: "empty-state",
            },
            React.createElement(
              "span",
              {
                className: "material-symbols-outlined",
              },
              "receipt_long",
            ),
            React.createElement("h3", null, "No orders yet"),
            React.createElement(
              "p",
              null,
              "Create your first order to get started.",
            ),
            React.createElement(
              "button",
              {
                className: "btn btn-primary",
                style: {
                  marginTop: "1rem",
                },
                onClick: () => onNavigate("create-order"),
              },
              "Create Order",
            ),
          )
        : React.createElement(
            "div",
            {
              className: "card",
              style: {
                padding: "0.5rem 0",
              },
            },
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
                    React.createElement("th", null, "Order ID"),
                    React.createElement("th", null, "Customer"),
                    React.createElement("th", null, "Status"),
                    React.createElement("th", null, "Items"),
                    React.createElement("th", null, "Total"),
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
                  orders.map((o) =>
                    React.createElement(
                      "tr",
                      {
                        key: o.id,
                      },
                      React.createElement(
                        "td",
                        {
                          className: "font-medium",
                          style: {
                            fontFamily: "monospace",
                            fontSize: "0.8125rem",
                          },
                        },
                        o.id.substring(0, 8),
                        "\u2026",
                      ),
                      React.createElement(
                        "td",
                        {
                          className: "font-medium",
                        },
                        o.customerName,
                      ),
                      React.createElement(
                        "td",
                        null,
                        React.createElement(
                          "span",
                          {
                            className: `status-badge ${statusClass(o.orderStatus)}`,
                          },
                          o.orderStatus,
                        ),
                      ),
                      React.createElement(
                        "td",
                        null,
                        o.itemCount,
                        " item",
                        o.itemCount !== 1 ? "s" : "",
                      ),
                      React.createElement(
                        "td",
                        {
                          className: "font-medium",
                        },
                        formatCurrency(o.totalAmount),
                      ),
                      React.createElement("td", null, formatDate(o.createdAt)),
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
                            onClick: () => onNavigate("order-details:" + o.id),
                            title: "View details",
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
