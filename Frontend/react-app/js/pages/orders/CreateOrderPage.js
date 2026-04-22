function CreateOrderPage({ onNavigate }) {
  const emptyItem = () => ({
    SKU: "",
    name: "",
    quantity: 1,
    priceAtPurchase: "",
  });
  const [form, setForm] = React.useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
  });
  const [items, setItems] = React.useState([emptyItem()]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const mockProducts = [
    {
      sku: "LOG-QFR-902",
      name: "Quantum Flux Regulator",
      stock: "IN STOCK",
      price: 149.99,
      icon: "tune",
    },
    {
      sku: "LOG-HLP-114",
      name: "High-Load Piston Unit",
      stock: "IN STOCK",
      price: 89.5,
      icon: "precision_manufacturing",
    },
    {
      sku: "LOG-KIM-552",
      name: "Kinetic Interface Module",
      stock: "LOW STOCK",
      price: 299.99,
      icon: "memory",
    },
  ];
  const handleSelectProduct = (prod) => {
    setItems((prev) => {
      const isFirstEmpty = prev.length === 1 && !prev[0].SKU && !prev[0].name;
      const newItem = {
        SKU: prod.sku,
        name: prod.name,
        quantity: 1,
        priceAtPurchase: prod.price,
      };
      if (isFirstEmpty) return [newItem];
      return [...prev, newItem];
    });
    setSearchQuery("");
    setShowModal(false);
  };
  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };
  const handleItemChange = (idx, field, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        [field]: value,
      };
      return copy;
    });
    setError("");
  };
  const addItem = () => setShowModal(true);
  const removeItem = (idx) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };
  const totalAmount = items.reduce((sum, it) => {
    const q = parseInt(it.quantity, 10) || 0;
    const p = parseFloat(it.priceAtPurchase) || 0;
    return sum + q * p;
  }, 0);
  const validate = () => {
    if (!form.customerName.trim()) return "Customer name is required.";
    if (!form.customerPhone.trim()) return "Customer phone is required.";
    if (!form.customerAddress.trim()) return "Customer address is required.";
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.SKU.trim()) return `Item ${i + 1}: SKU is required.`;
      if (!it.name.trim()) return `Item ${i + 1}: Name is required.`;
      if (!it.quantity || parseInt(it.quantity, 10) < 1)
        return `Item ${i + 1}: Quantity must be at least 1.`;
      if (!it.priceAtPurchase || parseFloat(it.priceAtPurchase) <= 0)
        return `Item ${i + 1}: Price must be greater than 0.`;
    }
    return "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        items: items.map((it) => ({
          SKU: it.SKU,
          name: it.name,
          quantity: parseInt(it.quantity, 10),
          priceAtPurchase: parseFloat(it.priceAtPurchase),
        })),
      };
      await OrderAPI.createOrder(payload);
      onNavigate("orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);
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
        React.createElement("h2", null, "Create Order"),
        React.createElement(
          "p",
          null,
          "Fill in customer details and add items.",
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "card",
        style: {
          padding: "2rem",
        },
      },
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
      React.createElement(
        "form",
        {
          onSubmit: handleSubmit,
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
            style: {
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            },
          },
          React.createElement(
            "div",
            {
              className: "form-group",
            },
            React.createElement(
              "label",
              {
                htmlFor: "co-name",
              },
              "Customer Name",
            ),
            React.createElement("input", {
              id: "co-name",
              className: "form-input",
              type: "text",
              name: "customerName",
              placeholder: "Company or person name",
              value: form.customerName,
              onChange: handleChange,
            }),
          ),
          React.createElement(
            "div",
            {
              className: "form-group",
            },
            React.createElement(
              "label",
              {
                htmlFor: "co-phone",
              },
              "Phone",
            ),
            React.createElement("input", {
              id: "co-phone",
              className: "form-input",
              type: "tel",
              name: "customerPhone",
              placeholder: "+1-555-0100",
              value: form.customerPhone,
              onChange: handleChange,
            }),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "form-group",
          },
          React.createElement(
            "label",
            {
              htmlFor: "co-address",
            },
            "Address",
          ),
          React.createElement("input", {
            id: "co-address",
            className: "form-input",
            type: "text",
            name: "customerAddress",
            placeholder: "Full shipping address",
            value: form.customerAddress,
            onChange: handleChange,
          }),
        ),
        React.createElement("div", {
          className: "divider",
        }),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            },
          },
          React.createElement("h3", null, "Order Items"),
          React.createElement(
            "button",
            {
              type: "button",
              className: "btn btn-secondary btn-sm",
              onClick: addItem,
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
            "Add Item",
          ),
        ),
        React.createElement(
          "div",
          {
            className: "item-row",
            style: {
              marginBottom: "0.25rem",
            },
          },
          React.createElement(
            "div",
            {
              style: {
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--outline)",
              },
            },
            "SKU",
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--outline)",
              },
            },
            "Name",
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--outline)",
              },
            },
            "Qty",
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--outline)",
              },
            },
            "Price ($)",
          ),
          React.createElement("div", null),
        ),
        items.map((item, idx) =>
          React.createElement(
            "div",
            {
              className: "item-row",
              key: idx,
            },
            React.createElement(
              "div",
              {
                className: "form-group",
              },
              React.createElement("input", {
                className: "form-input",
                type: "text",
                placeholder: "ELEC-001",
                value: item.SKU,
                onChange: (e) => handleItemChange(idx, "SKU", e.target.value),
              }),
            ),
            React.createElement(
              "div",
              {
                className: "form-group",
              },
              React.createElement("input", {
                className: "form-input",
                type: "text",
                placeholder: "Product name",
                value: item.name,
                onChange: (e) => handleItemChange(idx, "name", e.target.value),
              }),
            ),
            React.createElement(
              "div",
              {
                className: "form-group",
              },
              React.createElement("input", {
                className: "form-input",
                type: "number",
                min: "1",
                placeholder: "1",
                value: item.quantity,
                onChange: (e) =>
                  handleItemChange(idx, "quantity", e.target.value),
              }),
            ),
            React.createElement(
              "div",
              {
                className: "form-group",
              },
              React.createElement("input", {
                className: "form-input",
                type: "number",
                min: "0.01",
                step: "0.01",
                placeholder: "0.00",
                value: item.priceAtPurchase,
                onChange: (e) =>
                  handleItemChange(idx, "priceAtPurchase", e.target.value),
              }),
            ),
            React.createElement(
              "div",
              null,
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "btn-ghost",
                  style: {
                    padding: "0.375rem",
                    color:
                      items.length <= 1
                        ? "var(--outline-variant)"
                        : "var(--error)",
                  },
                  onClick: () => removeItem(idx),
                  disabled: items.length <= 1,
                  title: "Remove item",
                },
                React.createElement(
                  "span",
                  {
                    className: "material-symbols-outlined",
                    style: {
                      fontSize: "1.125rem",
                    },
                  },
                  "close",
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
            {
              style: {
                color: "var(--on-surface)",
              },
            },
            formatCurrency(totalAmount),
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.5rem",
            },
          },
          React.createElement(
            "button",
            {
              type: "submit",
              className: "btn btn-primary",
              disabled: loading,
              id: "co-submit",
            },
            loading &&
              React.createElement("div", {
                className: "spinner",
                style: {
                  borderTopColor: "#fff",
                },
              }),
            loading ? "Creating…" : "Create Order",
          ),
          React.createElement(
            "button",
            {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => onNavigate("orders"),
            },
            "Cancel",
          ),
        ),
      ),
    ),
    showModal &&
      React.createElement(
        "div",
        { className: "modal-overlay", onClick: () => setShowModal(false) },
        React.createElement(
          "div",
          {
            className: "modal-box",
            style: {
              maxWidth: "600px",
              padding: "0",
              display: "flex",
              flexDirection: "column",
            },
            onClick: (e) => e.stopPropagation(),
          },
          React.createElement(
            "div",
            {
              style: {
                padding: "1.5rem",
                borderBottom: "1px solid var(--surface-container)",
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid var(--primary-fixed-dim)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.75rem 1rem",
                  background: "#fcfbfe",
                },
              },
              React.createElement(
                "span",
                {
                  className: "material-symbols-outlined",
                  style: {
                    color: "var(--primary)",
                    marginRight: "0.75rem",
                    fontSize: "1.25rem",
                  },
                },
                "search",
              ),
              React.createElement("input", {
                type: "text",
                placeholder: "Search products to add...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                style: {
                  border: "none",
                  background: "transparent",
                  width: "100%",
                  outline: "none",
                  fontSize: "0.9375rem",
                  color: "var(--on-surface)",
                },
              }),
              React.createElement(
                "span",
                {
                  className: "material-symbols-outlined",
                  style: {
                    color: "var(--on-surface-variant)",
                    cursor: "pointer",
                    marginLeft: "0.75rem",
                    fontSize: "1.25rem",
                  },
                  onClick: () => setShowModal(false),
                },
                "close",
              ),
            ),
          ),
          React.createElement(
            "div",
            { style: { padding: "1.5rem" } },
            React.createElement(
              "div",
              {
                style: {
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "var(--outline)",
                  marginBottom: "1rem",
                },
              },
              "SUGGESTED PRODUCTS",
            ),
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                },
              },
              mockProducts
                .filter(
                  (p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((prod, idx) =>
                  React.createElement(
                    "div",
                    {
                      key: idx,
                      onClick: () => handleSelectProduct(prod),
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      },
                      onMouseEnter: (e) =>
                        (e.currentTarget.style.background =
                          "var(--surface-container-low)"),
                      onMouseLeave: (e) =>
                        (e.currentTarget.style.background = "transparent"),
                    },
                    React.createElement(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        },
                      },
                      React.createElement(
                        "div",
                        {
                          style: {
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--surface-container-low)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)",
                          },
                        },
                        React.createElement(
                          "span",
                          {
                            className: "material-symbols-outlined",
                            style: { fontSize: "1.25rem" },
                          },
                          prod.icon,
                        ),
                      ),
                      React.createElement(
                        "div",
                        null,
                        React.createElement(
                          "div",
                          {
                            style: {
                              fontWeight: 600,
                              fontSize: "0.9375rem",
                              color: "var(--on-surface)",
                            },
                          },
                          prod.name,
                        ),
                        React.createElement(
                          "div",
                          {
                            style: {
                              fontSize: "0.75rem",
                              color: "var(--on-surface-variant)",
                            },
                          },
                          "SKU: " + prod.sku,
                        ),
                      ),
                    ),
                    React.createElement(
                      "div",
                      {
                        style: {
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          padding: "0.25rem 0.625rem",
                          borderRadius: "var(--radius-sm)",
                          background:
                            prod.stock === "IN STOCK"
                              ? "rgba(53, 37, 205, 0.1)"
                              : "rgba(126, 48, 0, 0.1)",
                          color:
                            prod.stock === "IN STOCK"
                              ? "var(--primary)"
                              : "var(--tertiary)",
                        },
                      },
                      prod.stock,
                    ),
                  ),
                ),
            ),
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "1rem 1.5rem",
                background: "var(--surface-container-lowest)",
                borderTop: "1px solid var(--surface-container)",
                borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                  color: "var(--on-surface-variant)",
                },
              },
              "Tip: Use arrow keys to navigate",
            ),
            React.createElement(
              "button",
              {
                style: {
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--on-surface)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                },
                onClick: () => setShowModal(false),
              },
              "CLOSE",
            ),
          ),
        ),
      ),
  ); // Closes root div
}
