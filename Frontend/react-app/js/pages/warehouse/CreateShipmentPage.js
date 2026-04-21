function CreateShipmentPage({ onNavigate }) {
  const h = React.createElement;
  const [form, setForm] = React.useState({
    orderId: "",
    carrier: "FedEx",
    weight: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mock Shipment Created! Tracking: 1Z9999999999999999");
    onNavigate("shipments");
  };
  return h(
    "div",
    null,
    h(
      "div",
      { className: "page-header" },
      h(
        "div",
        null,
        h("h2", null, "Create Shipment"),
        h("p", null, "Generate a shipping label and dispatch an order."),
      ),
    ),
    h(
      "div",
      { className: "card", style: { maxWidth: "600px", padding: "2rem" } },
      h(
        "form",
        { onSubmit: handleSubmit },
        h(
          "div",
          { className: "form-group" },
          h("label", null, "Order ID"),
          h("input", {
            className: "form-input",
            type: "text",
            placeholder: "ORD-XXXX",
            required: true,
            value: form.orderId,
            onChange: (e) => setForm({ ...form, orderId: e.target.value }),
          }),
        ),
        h(
          "div",
          { className: "form-group" },
          h("label", null, "Select Carrier"),
          h(
            "select",
            {
              className: "form-input",
              value: form.carrier,
              onChange: (e) => setForm({ ...form, carrier: e.target.value }),
            },
            h("option", { value: "FedEx" }, "FedEx"),
            h("option", { value: "UPS" }, "UPS"),
            h("option", { value: "DHL" }, "DHL"),
          ),
        ),
        h(
          "div",
          { className: "form-group" },
          h("label", null, "Package Weight (lbs)"),
          h("input", {
            className: "form-input",
            type: "number",
            step: "0.1",
            required: true,
            value: form.weight,
            onChange: (e) => setForm({ ...form, weight: e.target.value }),
          }),
        ),
        h(
          "div",
          { style: { marginTop: "2rem", display: "flex", gap: "0.75rem" } },
          h(
            "button",
            { type: "submit", className: "btn btn-primary" },
            "Generate Label",
          ),
          h(
            "button",
            {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => onNavigate("shipments"),
            },
            "Cancel",
          ),
        ),
      ),
    ),
  );
}
