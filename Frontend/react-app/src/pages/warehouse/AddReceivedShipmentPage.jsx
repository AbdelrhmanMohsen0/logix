import React from 'react';
import { WarehouseAPI, InventoryAPI } from '../../services/api';

function AddReceivedShipmentPage({ onNavigate }) {
  const [form, setForm] = React.useState({ shipmentId: "", supplier: "" });
  const [items, setItems] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [modalForm, setModalForm] = React.useState({
    sku: "",
    qty: 1,
  });
  const [editIndex, setEditIndex] = React.useState(null);
  const [formError, setFormError] = React.useState("");
  const [modalError, setModalError] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.shipmentId || !form.supplier) {
      setFormError("Shipment Title and Supplier are required.");
      return;
    }
    if (items.length === 0) {
      setFormError("Please add at least one item to the shipment.");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        shipmentId: form.shipmentId,
        supplierName: form.supplier,
        items: items.map(it => ({
          sku: it.sku,
          quantity: parseInt(it.qty, 10)
        }))
      };
      await InventoryAPI.processShipment(payload);
      setSuccessMsg("Shipment Received! Stock added to inventory.");
      setTimeout(() => onNavigate("inbound-shipments"), 1500);
    } catch (err) {
      setFormError("Error adding shipment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!modalForm.sku || !modalForm.qty) {
      setModalError("Please provide both SKU and Quantity.");
      return;
    }
    setModalError("");
    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = modalForm;
      setItems(updated);
      setEditIndex(null);
    } else {
      setItems([...items, modalForm]);
    }
    setModalForm({ sku: "", qty: 1 });
    setShowModal(false);
  };

  const handleEditItem = (idx) => {
    setEditIndex(idx);
    setModalForm(items[idx]);
    setShowModal(true);
  };

  const handleDeleteItem = (idx) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
  };

  const openNewItemModal = () => {
    setEditIndex(null);
    setModalForm({ sku: "", qty: 1 });
    setShowModal(true);
  };
  return (
    <div>
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800" }}>
            Add New Received Shipment
          </h2>
          <p style={{ fontSize: "1.125rem" }}>
            Verify incoming product quantities and assign precise storage locations within the facility.
          </p>
        </div>
      </div>
      {successMsg && (
        <div style={{ marginBottom: "2rem", padding: "1rem", borderRadius: "0.5rem", background: "rgba(40, 167, 69, 0.1)", color: "#28a745", fontWeight: "600" }}>
          {successMsg}
        </div>
      )}
      {formError && (
        <div style={{ marginBottom: "2rem", padding: "1rem", borderRadius: "0.5rem", background: "var(--error-container)", color: "var(--error)", fontWeight: "600" }}>
          {formError}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            marginBottom: "3rem",
          }}>
          <div className="form-group">
            <label style={{ fontWeight: "600" }}>
              Shipment Title
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. #SHP-1024"
              required={true}
              value={form.shipmentId}
              onChange={(e) => setForm({ ...form, shipmentId: e.target.value })} />
          </div>
          <div className="form-group">
            <label style={{ fontWeight: "600" }}>
              Supplier
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Global Logistics Inc."
              required={true}
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
            Received Products
          </h3>
          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: "0.625rem 1.25rem", borderRadius: "0.5rem" }}
            onClick={openNewItemModal}>
            <span
              className="material-symbols-outlined"
              style={{ marginRight: "0.5rem", fontSize: "1.25rem" }}>
              add
            </span>
            Add Product
          </button>
        </div>
        <div className="card" style={{ padding: "0", marginBottom: "2rem" }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
                    SKU
                  </th>
                  <th>
                    QUANTITY
                  </th>
                  <th style={{ textAlign: "right" }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "2rem", color: "var(--on-surface-variant)" }}>
                      No items added yet. Click "Add Product" to begin.
                    </td>
                  </tr>
                ) : (
                  items.map((it, idx) =>
                    <tr key={idx}>
                      <td>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "var(--on-surface)",
                          }}>
                          {it.sku}
                        </div>
                      </td>
                      <td style={{ fontWeight: "600", color: "var(--on-surface)" }}>
                        {it.qty}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => handleEditItem(idx)}
                          style={{ padding: "0.25rem", marginRight: "0.5rem" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => handleDeleteItem(idx)}
                          style={{ padding: "0.25rem", color: "var(--error)" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>delete</span>
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1.5rem",
            alignItems: "center",
          }}>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              color: "var(--on-surface-variant)",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => onNavigate("inbound-shipments")}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
            }}>
            Save Shipment to Inventory
          </button>
        </div>
      </form>
      {showModal &&
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-box"
            style={{ maxWidth: "500px", padding: "2.5rem 2rem" }}
            onClick={(e) => e.stopPropagation()}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                marginBottom: "0.5rem",
                color: "var(--on-surface)",
              }}>
              {editIndex !== null ? "Edit Item" : "Add Item"}
            </h3>
            <p
              style={{
                color: "var(--on-surface-variant)",
                marginBottom: "2rem",
              }}>
              Enter the SKU and quantity of the received product.
            </p>
            {modalError && (
              <div style={{ marginBottom: "1rem", color: "var(--error)", fontWeight: "600" }}>
                {modalError}
              </div>
            )}
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontWeight: "600", color: "var(--on-surface)" }}>
                SKU
              </label>
              <input
                className="form-input"
                style={{ background: "#fcfbfe" }}
                type="text"
                placeholder="e.g. BAT-2023-HC"
                required={true}
                value={modalForm.sku}
                onChange={(e) =>
                  setModalForm({ ...modalForm, sku: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label style={{ fontWeight: "600", color: "var(--on-surface)" }}>
                Quantity
              </label>
              <input
                className="form-input"
                style={{ background: "#fcfbfe" }}
                type="number"
                min="1"
                required={true}
                value={modalForm.qty}
                onChange={(e) =>
                  setModalForm({
                    ...modalForm,
                    qty: parseInt(e.target.value) || "",
                  })} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1.5rem",
                alignItems: "center",
              }}>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--on-surface)",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: "0.625rem 1.5rem", borderRadius: "0.5rem" }}
                onClick={handleAddItem}>
                Add Item
              </button>
            </div>
          </div>
        </div>}
    </div>
  );
}

export default AddReceivedShipmentPage;
