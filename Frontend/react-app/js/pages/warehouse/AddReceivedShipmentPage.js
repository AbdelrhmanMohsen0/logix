function AddReceivedShipmentPage({ onNavigate }) {
  const h = React.createElement;
  const [form, setForm] = React.useState({ shipmentId: "", supplier: "" });
  const [items, setItems] = React.useState([
    {
      name: "High-Capacity Lithium Cell",
      sku: "BAT-2023-HC",
      qty: 400,
      loc: "Zone A-04-B",
    },
    {
      name: "Precision Control Board",
      sku: "PCB-MOD-88",
      qty: 120,
      loc: "Zone C-12-F",
    },
    {
      name: "Industrial Grade Housing",
      sku: "HSN-IND-V2",
      qty: 720,
      loc: "Zone B-02-A",
    },
  ]);
  const [showModal, setShowModal] = React.useState(false);
  const [modalForm, setModalForm] = React.useState({
    name: "",
    sku: "",
    qty: 1,
    loc: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mock Shipment Added Successfully!");
    onNavigate("inbound-shipments");
  };
  const handleAddItem = () => {
    if (modalForm.name && modalForm.sku && modalForm.qty && modalForm.loc) {
      setItems([...items, modalForm]);
      setModalForm({ name: "", sku: "", qty: 1, loc: "" });
      setShowModal(false);
    }
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
          "Add New Received Shipment",
        ),
        h(
          "p",
          { style: { fontSize: "1.125rem" } },
          "Verify incoming product quantities and assign precise storage locations within the facility.",
        ),
      ),
    ),
    h(
      "form",
      { onSubmit: handleSubmit },
      h(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            marginBottom: "3rem",
          },
        },
        h(
          "div",
          { className: "form-group" },
          h("label", { style: { fontWeight: "600" } }, "Shipment ID"),
          h("input", {
            className: "form-input",
            type: "text",
            placeholder: "e.g. #SHP-1024",
            required: true,
            value: form.shipmentId,
            onChange: (e) => setForm({ ...form, shipmentId: e.target.value }),
          }),
        ),
        h(
          "div",
          { className: "form-group" },
          h("label", { style: { fontWeight: "600" } }, "Supplier"),
          h("input", {
            className: "form-input",
            type: "text",
            placeholder: "e.g. Global Logistics Inc.",
            required: true,
            value: form.supplier,
            onChange: (e) => setForm({ ...form, supplier: e.target.value }),
          }),
        ),
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          },
        },
        h(
          "h3",
          { style: { fontSize: "1.5rem", fontWeight: "700" } },
          "Received Products",
        ),
        h(
          "button",
          {
            type: "button",
            className: "btn btn-primary",
            style: { padding: "0.625rem 1.25rem", borderRadius: "0.5rem" },
            onClick: () => setShowModal(true),
          },
          h(
            "span",
            {
              className: "material-symbols-outlined",
              style: { marginRight: "0.5rem", fontSize: "1.25rem" },
            },
            "add",
          ),
          "Add Product",
        ),
      ),
      h(
        "div",
        { className: "card", style: { padding: "0", marginBottom: "2rem" } },
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
                h("th", null, "PRODUCT"),
                h("th", null, "QUANTITY"),
                h("th", null, "LOCATION"),
              ),
            ),
            h(
              "tbody",
              null,
              items.map((it, idx) =>
                h(
                  "tr",
                  { key: idx },
                  h(
                    "td",
                    null,
                    h(
                      "div",
                      {
                        style: {
                          fontWeight: "700",
                          color: "var(--on-surface)",
                        },
                      },
                      it.name,
                    ),
                    h(
                      "div",
                      {
                        style: {
                          fontSize: "0.75rem",
                          color: "var(--on-surface-variant)",
                        },
                      },
                      "SKU: " + it.sku,
                    ),
                  ),
                  h(
                    "td",
                    {
                      style: { fontWeight: "600", color: "var(--on-surface)" },
                    },
                    it.qty,
                  ),
                  h(
                    "td",
                    null,
                    h(
                      "span",
                      {
                        className: "status-badge default",
                        style: {
                          background: "rgba(53, 37, 205, 0.1)",
                          color: "var(--primary)",
                          padding: "0.375rem 0.75rem",
                          borderRadius: "1rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        },
                      },
                      it.loc,
                    ),
                  ),
                ),
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
            justifyContent: "flex-end",
            gap: "1.5rem",
            alignItems: "center",
          },
        },
        h(
          "button",
          {
            type: "button",
            style: {
              background: "none",
              border: "none",
              color: "var(--on-surface-variant)",
              fontWeight: "600",
              cursor: "pointer",
            },
            onClick: () => onNavigate("inbound-shipments"),
          },
          "Cancel",
        ),
        h(
          "button",
          {
            type: "submit",
            className: "btn btn-primary",
            style: {
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
            },
          },
          "Save Shipment to Inventory",
        ),
      ),
    ),
    showModal &&
      h(
        "div",
        { className: "modal-overlay", onClick: () => setShowModal(false) },
        h(
          "div",
          {
            className: "modal-box",
            style: { maxWidth: "500px", padding: "2.5rem 2rem" },
            onClick: (e) => e.stopPropagation(),
          },
          h(
            "h3",
            {
              style: {
                fontSize: "1.5rem",
                fontWeight: "800",
                marginBottom: "0.5rem",
                color: "var(--on-surface)",
              },
            },
            "Add Item to Shipment",
          ),
          h(
            "p",
            {
              style: {
                color: "var(--on-surface-variant)",
                marginBottom: "2rem",
              },
            },
            "Enter item details and storage location.",
          ),
          h(
            "div",
            { className: "form-group", style: { marginBottom: "1.5rem" } },
            h(
              "label",
              { style: { fontWeight: "600", color: "var(--on-surface)" } },
              "Item",
            ),
            h(
              "div",
              { style: { position: "relative" } },
              h(
                "span",
                {
                  className: "material-symbols-outlined",
                  style: {
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--on-surface-variant)",
                  },
                },
                "search",
              ),
              h("input", {
                className: "form-input",
                style: {
                  paddingLeft: "2.75rem",
                  background: "#f8f9ff",
                  border: "1px solid var(--surface-container-high)",
                },
                type: "text",
                placeholder: "Item",
                required: true,
                value: modalForm.name,
                onChange: (e) =>
                  setModalForm({ ...modalForm, name: e.target.value }),
              }),
            ),
          ),
          h(
            "div",
            { className: "form-group", style: { marginBottom: "1.5rem" } },
            h(
              "label",
              { style: { fontWeight: "600", color: "var(--on-surface)" } },
              "SKU",
            ),
            h("input", {
              className: "form-input",
              style: { background: "#fcfbfe" },
              type: "text",
              placeholder: "e.g. BAT-2023-HC",
              required: true,
              value: modalForm.sku,
              onChange: (e) =>
                setModalForm({ ...modalForm, sku: e.target.value }),
            }),
          ),
          h(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              },
            },
            h(
              "div",
              { className: "form-group" },
              h(
                "label",
                { style: { fontWeight: "600", color: "var(--on-surface)" } },
                "Quantity",
              ),
              h("input", {
                className: "form-input",
                style: { background: "#fcfbfe" },
                type: "number",
                min: "1",
                required: true,
                value: modalForm.qty,
                onChange: (e) =>
                  setModalForm({
                    ...modalForm,
                    qty: parseInt(e.target.value) || 1,
                  }),
              }),
            ),
            h(
              "div",
              { className: "form-group" },
              h(
                "label",
                { style: { fontWeight: "600", color: "var(--on-surface)" } },
                "Location",
              ),
              h("input", {
                className: "form-input",
                style: { background: "#fcfbfe" },
                type: "text",
                placeholder: "Zone-Aisle-Bin",
                required: true,
                value: modalForm.loc,
                onChange: (e) =>
                  setModalForm({ ...modalForm, loc: e.target.value }),
              }),
            ),
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "flex-end",
                gap: "1.5rem",
                alignItems: "center",
              },
            },
            h(
              "button",
              {
                type: "button",
                style: {
                  background: "none",
                  border: "none",
                  color: "var(--on-surface)",
                  fontWeight: "600",
                  cursor: "pointer",
                },
                onClick: () => setShowModal(false),
              },
              "Cancel",
            ),
            h(
              "button",
              {
                type: "button",
                className: "btn btn-primary",
                style: { padding: "0.625rem 1.5rem", borderRadius: "0.5rem" },
                onClick: handleAddItem,
              },
              "Add Item",
            ),
          ),
        ),
      ),
  );
}
