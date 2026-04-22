import React from 'react';

function CreateShipmentPage({ onNavigate }) {
  
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
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Create Shipment
          </h2>
          <p>
            Generate a shipping label and dispatch an order.
          </p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: "600px", padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Order ID
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="ORD-XXXX"
              required={true}
              value={form.orderId}
              onChange={(e) => setForm({ ...form, orderId: e.target.value })} />
          </div>
          <div className="form-group">
            <label>
              Select Carrier
            </label>
            <select
              className="form-input"
              value={form.carrier}
              onChange={(e) => setForm({ ...form, carrier: e.target.value })}>
              <option value="FedEx">
                FedEx
              </option>
              <option value="UPS">
                UPS
              </option>
              <option value="DHL">
                DHL
              </option>
            </select>
          </div>
          <div className="form-group">
            <label>
              Package Weight (lbs)
            </label>
            <input
              className="form-input"
              type="number"
              step="0.1"
              required={true}
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}>
            <button type="submit" className="btn btn-primary">
              Generate Label
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate("shipments")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateShipmentPage;
