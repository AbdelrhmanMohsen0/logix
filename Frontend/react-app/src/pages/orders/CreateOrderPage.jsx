import React from 'react';
import { AuthAPI, UserAPI, OrderAPI, TokenService } from '../../services/api';
import { useInventory } from '../../context/InventoryContext';

function CreateOrderPage({ onNavigate }) {
  const { items: inventoryItems, updateInventoryItem } = useInventory();
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
    const digitsOnly = form.customerPhone.replace(/\D/g, "");
    if (digitsOnly.length < 10) return "Customer phone must be a valid, complete number.";
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
      
      // Inventory reduction
      payload.items.forEach(it => {
        const inventoryItem = inventoryItems.find(i => i.sku === it.SKU);
        if (inventoryItem) {
          updateInventoryItem(it.SKU, {
            qty: Math.max(0, inventoryItem.qty - it.quantity)
          });
        }
      });
      
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
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Create Order
          </h2>
          <p>
            Fill in customer details and add items.
          </p>
        </div>
      </div>
      <div
        className="card"
        style={{
          padding: "2rem",
        }}>
        {error &&
          <div className="alert alert-error">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "1rem",
              }}>
              error
            </span>
            {error}
          </div>}
        <form onSubmit={handleSubmit}>
          <h3
            style={{
              marginBottom: "1.25rem",
            }}>
            Customer Information
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="co-name">
                Customer Name
              </label>
              <input
                id="co-name"
                className="form-input"
                type="text"
                name="customerName"
                placeholder="Company or person name"
                value={form.customerName}
                onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="co-phone">
                Phone
              </label>
              <input
                id="co-phone"
                className="form-input"
                type="tel"
                name="customerPhone"
                placeholder="+1-555-0100"
                value={form.customerPhone}
                onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="co-address">
              Address
            </label>
            <input
              id="co-address"
              className="form-input"
              type="text"
              name="customerAddress"
              placeholder="Full shipping address"
              value={form.customerAddress}
              onChange={handleChange} />
          </div>
          <div className="divider" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}>
            <h3>
              Order Items
            </h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "1rem",
                }}>
                add
              </span>
              Add Item
            </button>
          </div>
          <div
            className="item-row"
            style={{
              marginBottom: "0.25rem",
            }}>
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--outline)",
              }}>
              SKU
            </div>
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--outline)",
              }}>
              Name
            </div>
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--outline)",
              }}>
              Qty
            </div>
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--outline)",
              }}>
              Price ($)
            </div>
            <div />
          </div>
          {items.map((item, idx) =>
            <div className="item-row" key={idx}>
              <div className="form-group">
                <input
                  className="form-input"
                  type="text"
                  placeholder="ELEC-001"
                  value={item.SKU}
                  onChange={(e) => handleItemChange(idx, "SKU", e.target.value)} />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Product name"
                  value={item.name}
                  onChange={(e) => handleItemChange(idx, "name", e.target.value)} />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(idx, "quantity", e.target.value)} />
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={item.priceAtPurchase}
                  onChange={(e) =>
                    handleItemChange(idx, "priceAtPurchase", e.target.value)} />
              </div>
              <div>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{
                    padding: "0.375rem",
                    color:
                      items.length <= 1
                        ? "var(--outline-variant)"
                        : "var(--error)",
                  }}
                  onClick={() => removeItem(idx)}
                  disabled={items.length <= 1}
                  title="Remove item">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "1.125rem",
                    }}>
                    close
                  </span>
                </button>
              </div>
            </div>,
          )}
          <div className="total-bar">
            <span
              style={{
                color: "var(--on-surface-variant)",
                fontWeight: 500,
              }}>
              Total:
            </span>
            <span
              style={{
                color: "var(--on-surface)",
              }}>
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.5rem",
            }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="co-submit">
              {loading &&
                <div
                  className="spinner"
                  style={{
                    borderTopColor: "#fff",
                  }} />}
              {loading ? "Creating…" : "Create Order"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate("orders")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {showModal &&
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-box"
            style={{
              maxWidth: "600px",
              padding: "0",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid var(--surface-container)",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid var(--primary-fixed-dim)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.75rem 1rem",
                  background: "#fcfbfe",
                }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: "var(--primary)",
                    marginRight: "0.75rem",
                    fontSize: "1.25rem",
                  }}>
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search products to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    width: "100%",
                    outline: "none",
                    fontSize: "0.9375rem",
                    color: "var(--on-surface)",
                  }} />
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: "var(--on-surface-variant)",
                    cursor: "pointer",
                    marginLeft: "0.75rem",
                    fontSize: "1.25rem",
                  }}
                  onClick={() => setShowModal(false)}>
                  close
                </span>
              </div>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "var(--outline)",
                  marginBottom: "1rem",
                }}>
                SUGGESTED PRODUCTS
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}>
                {inventoryItems
                  .filter(
                    (p) =>
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((prod, idx) => {
                    const inStock = prod.qty > 0;
                    const stockText = inStock ? "IN STOCK" : "OUT OF STOCK";
                    return (
                    <div
                      key={idx}
                      onClick={() => handleSelectProduct(prod)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--surface-container-low)")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}>
                        <div
                          style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--surface-container-low)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)",
                          }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
                            {prod.icon || "inventory_2"}
                          </span>
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.9375rem",
                              color: "var(--on-surface)",
                            }}>
                            {prod.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--on-surface-variant)",
                            }}>
                            {"SKU: " + prod.sku}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          padding: "0.25rem 0.625rem",
                          borderRadius: "var(--radius-sm)",
                          background:
                            inStock
                              ? "rgba(53, 37, 205, 0.1)"
                              : "rgba(186, 26, 26, 0.1)",
                          color:
                            inStock
                              ? "var(--primary)"
                              : "var(--error)",
                        }}>
                        {stockText}
                      </div>
                    </div>
                  )})}
              </div>
            </div>
            <div
              style={{
                padding: "1rem 1.5rem",
                background: "var(--surface-container-lowest)",
                borderTop: "1px solid var(--surface-container)",
                borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                  color: "var(--on-surface-variant)",
                }}>
                Tip: Use arrow keys to navigate
              </div>
              <button
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--on-surface)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
                onClick={() => setShowModal(false)}>
                CLOSE
              </button>
            </div>
          </div>
        </div>}
    </div>
  ); // Closes root div
}

export default CreateOrderPage;
