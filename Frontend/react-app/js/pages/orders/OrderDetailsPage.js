function OrderDetailsPage({ orderId, onNavigate }) {
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [statusLoading, setStatusLoading] = React.useState(false);
  const fetchOrder = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await OrderAPI.getOrder(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);
  React.useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);
  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n || 0);
  const formatDateTime = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const statusClass = (s) => (s || "").toLowerCase();
  const allStatuses = [
    "CREATED",
    "PENDING",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
  ];
  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    try {
      const updated = await OrderAPI.updateOrderStatus(orderId, newStatus);
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };
  if (loading) {
    return React.createElement(
      "div",
      {
        className: "loading-center",
      },
      React.createElement("div", {
        className: "spinner spinner-lg",
      }),
    );
  }
  if (error) {
    return React.createElement(
      "div",
      null,
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
      React.createElement(
        "button",
        {
          className: "btn btn-secondary",
          onClick: () => onNavigate("orders"),
        },
        "\u2190 Back to Orders",
      ),
    );
  }
  if (!order) return null;
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
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.25rem",
            },
          },
          React.createElement(
            "h2",
            {
              style: {
                margin: 0,
              },
            },
            "Order Details",
          ),
          React.createElement(
            "span",
            {
              className: `status-badge ${statusClass(order.orderStatus)}`,
            },
            order.orderStatus,
          ),
        ),
        React.createElement(
          "p",
          {
            style: {
              fontFamily: "monospace",
              fontSize: "0.8125rem",
            },
          },
          order.id,
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
            onClick: () => onNavigate("orders"),
          },
          React.createElement(
            "span",
            {
              className: "material-symbols-outlined",
              style: {
                fontSize: "1rem",
              },
            },
            "arrow_back",
          ),
          "Back to Orders",
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
      "Order details are simulated. Backend GET /order/",
      "{id}",
      " endpoint is not yet implemented.",
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
        },
      },
      React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          {
            className: "card",
            style: {
              padding: "1.5rem",
              marginBottom: "1.5rem",
            },
          },
          React.createElement(
            "h3",
            {
              style: {
                marginBottom: "1.25rem",
              },
            },
            "Customer Information",
          ),
          React.createElement(
            "div",
            {
              className: "detail-grid",
            },
            React.createElement(
              "div",
              {
                className: "detail-item",
              },
              React.createElement("label", null, "Customer Name"),
              React.createElement("p", null, order.customerName),
            ),
            React.createElement(
              "div",
              {
                className: "detail-item",
              },
              React.createElement("label", null, "Phone"),
              React.createElement("p", null, order.customerPhone),
            ),
            React.createElement(
              "div",
              {
                className: "detail-item",
              },
              React.createElement("label", null, "Address"),
              React.createElement("p", null, order.customerAddress),
            ),
            React.createElement(
              "div",
              {
                className: "detail-item",
              },
              React.createElement("label", null, "Total Amount"),
              React.createElement(
                "p",
                {
                  style: {
                    color: "var(--primary)",
                    fontWeight: 700,
                  },
                },
                formatCurrency(order.totalAmount),
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
            "h3",
            {
              style: {
                marginBottom: "1.25rem",
              },
            },
            "Order Items (",
            order.items.length,
            ")",
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
                  React.createElement("th", null, "SKU"),
                  React.createElement("th", null, "Product Name"),
                  React.createElement("th", null, "Qty"),
                  React.createElement("th", null, "Unit Price"),
                  React.createElement(
                    "th",
                    {
                      style: {
                        textAlign: "right",
                      },
                    },
                    "Subtotal",
                  ),
                ),
              ),
              React.createElement(
                "tbody",
                null,
                order.items.map((item, i) =>
                  React.createElement(
                    "tr",
                    {
                      key: i,
                    },
                    React.createElement(
                      "td",
                      {
                        style: {
                          fontFamily: "monospace",
                          fontSize: "0.8125rem",
                        },
                      },
                      item.SKU,
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "font-medium",
                      },
                      item.name,
                    ),
                    React.createElement("td", null, item.quantity),
                    React.createElement(
                      "td",
                      null,
                      formatCurrency(item.priceAtPurchase),
                    ),
                    React.createElement(
                      "td",
                      {
                        style: {
                          textAlign: "right",
                          fontWeight: 500,
                        },
                      },
                      formatCurrency(item.quantity * item.priceAtPurchase),
                    ),
                  ),
                ),
              ),
            ),
          ),
          React.createElement(
            "div",
            {
              className: "total-bar",
            },
            React.createElement(
              "span",
              {
                style: {
                  color: "var(--on-surface-variant)",
                  fontWeight: 500,
                },
              },
              "Total:",
            ),
            React.createElement(
              "span",
              null,
              formatCurrency(order.totalAmount),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          {
            className: "card",
            style: {
              padding: "1.5rem",
              marginBottom: "1.5rem",
            },
          },
          React.createElement(
            "h3",
            {
              style: {
                marginBottom: "1rem",
              },
            },
            "Update Status",
          ),
          React.createElement(
            "div",
            {
              className: "form-group",
              style: {
                marginBottom: "0.75rem",
              },
            },
            React.createElement(
              "select",
              {
                className: "form-input",
                value: order.orderStatus,
                onChange: (e) => handleStatusChange(e.target.value),
                disabled: statusLoading,
              },
              allStatuses.map((s) =>
                React.createElement(
                  "option",
                  {
                    key: s,
                    value: s,
                  },
                  s,
                ),
              ),
            ),
          ),
          statusLoading &&
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.8125rem",
                  color: "var(--on-surface-variant)",
                },
              },
              React.createElement("div", {
                className: "spinner",
              }),
              "Updating\u2026",
            ),
          React.createElement(
            "p",
            {
              style: {
                fontSize: "0.75rem",
                color: "var(--outline)",
                marginTop: "0.5rem",
              },
            },
            "Mock \u2014 PUT /order/",
            "{id}",
            "/status is not yet implemented.",
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
            "h3",
            {
              style: {
                marginBottom: "1.25rem",
              },
            },
            "Status History",
          ),
          React.createElement(
            "div",
            {
              className: "timeline",
            },
            [...order.statusHistory].reverse().map((sh, i) =>
              React.createElement(
                "div",
                {
                  className: "timeline-item",
                  key: i,
                },
                React.createElement("div", {
                  className: "timeline-dot",
                }),
                React.createElement("h4", null, sh.status),
                React.createElement(
                  "time",
                  null,
                  formatDateTime(sh.transitionedAt),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
