import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

function InventoryManagementPage({ searchQuery, routeParam, onNavigate }) {
  const { items, updateInventoryItem } = useInventory();
  
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    sku: '',
    name: '',
    qty: 0,
    loc: ''
  });

  const handleEditClick = (item) => {
    setEditingItem(item.sku);
    setEditForm({ ...item });
  };

  const handleEditChange = (e) => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSave = () => {
    if (editingItem) {
      updateInventoryItem(editingItem, {
        sku: editForm.sku,
        name: editForm.name,
        qty: parseInt(editForm.qty, 10) || 0,
        loc: editForm.loc
      });
      setEditingItem(null);
    }
  };

  const filteredItems = items.filter(i => {
    if (routeParam === "lowstock" && i.qty >= 50) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (i.sku && i.sku.toLowerCase().includes(q)) ||
      (i.name && i.name.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            Inventory Management
          </h2>
          <p>
            View and adjust current stock levels across all zones.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => alert("Mock: Adjust Stock")}>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              settings
            </span>
            Adjust Stock
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => alert("Mock: Add Stock")}>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              add
            </span>
            Add Stock
          </button>
        </div>
      </div>
      
      {routeParam === "lowstock" && (
        <div className="alert alert-error" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem", marginRight: "0.5rem" }}>
              warning
            </span>
            Showing low stock items only (Qty &lt; 50).
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => onNavigate("inventory")}
            style={{ background: "transparent", borderColor: "var(--error)", color: "var(--error)" }}>
            Clear Filter
          </button>
        </div>
      )}

      <div className="alert alert-info" style={{ marginBottom: "1.5rem" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
          info
        </span>
        Inventory data is simulated. Backend GET /inventory endpoint is not yet implemented.
      </div>
      <div className="card" style={{ padding: "0.5rem 0" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>
                  SKU
                </th>
                <th>
                  Product Name
                </th>
                <th>
                  Quantity
                </th>
                <th>
                  Location
                </th>
                <th>
                  Last Updated
                </th>
                <th style={{ textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 && items.length > 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                    No inventory items found for "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredItems.map((i, idx) =>
                  <tr key={idx}>
                    <td
                      className="font-medium"
                      style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>
                      {i.sku}
                    </td>
                    <td className="font-medium">
                      {i.name}
                    </td>
                    <td>
                      {i.qty > 50
                        ? <span className="status-badge success">
                        {i.qty}
                      </span>
                        : <span className="status-badge delayed">
                        {i.qty}
                      </span>}
                    </td>
                    <td>
                      {i.loc}
                    </td>
                    <td>
                      {new Date(i.updated).toLocaleString()}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn-ghost" title="Edit details" onClick={() => handleEditClick(i)}>
                        <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                          edit
                        </span>
                      </button>
                    </td>
                  </tr>,
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Inventory Item</h3>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>SKU</label>
              <input className="form-input" name="sku" value={editForm.sku} onChange={handleEditChange} />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input className="form-input" name="name" value={editForm.name} onChange={handleEditChange} />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input className="form-input" type="number" name="qty" value={editForm.qty} onChange={handleEditChange} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="form-input" name="loc" value={editForm.loc} onChange={handleEditChange} />
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingItem(null)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleEditSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryManagementPage;
