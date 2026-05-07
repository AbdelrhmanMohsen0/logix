import React, { useState, useEffect, useCallback } from 'react';
import { InventoryAPI } from '../../services/api';
import Pagination from '../../components/Pagination';

function InventoryManagementPage({ searchQuery, routeParam, onNavigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0, size: 10 });
  const [stockFilter, setStockFilter] = useState("ALL");
  const [localFilter, setLocalFilter] = useState("");

  // Add Product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', sku: '', quantity: '', price: '', location: '', threshold: '20' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit modal
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', sku: '', quantity: 0, price: 0, location: '', threshold: 20 });

  // Actions dropdown
  const [openMenu, setOpenMenu] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery) {
        const data = await InventoryAPI.searchProducts(searchQuery);
        setItems(data || []);
        setPageInfo({ totalElements: data?.length || 0, totalPages: 1, size: 10 });
      } else {
        const filter = routeParam === "lowstock" ? "LOW_STOCK" : stockFilter;
        const data = await InventoryAPI.getProducts(page, 10, filter);
        setItems(data?.content || []);
        setPageInfo(data?.page || { totalElements: 0, totalPages: 0, size: 10 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, routeParam, stockFilter, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    setPage(0);
  }, [stockFilter, searchQuery]);

  const handleAddChange = (e) => {
    setAddForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAddSubmit = async () => {
    setAddLoading(true);
    setAddError('');
    try {
      await InventoryAPI.createProduct({
        name: addForm.name,
        sku: addForm.sku,
        quantity: parseInt(addForm.quantity, 10) || 0,
        price: parseFloat(addForm.price) || 0,
        location: addForm.location,
        threshold: parseInt(addForm.threshold, 10) || 20,
      });
      setShowAddModal(false);
      setAddForm({ name: '', sku: '', quantity: '', price: '', location: '', threshold: '20' });
      fetchItems();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item.sku);
    setEditForm({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      location: item.location,
      threshold: 20,
    });
    setOpenMenu(null);
  };

  const handleEditChange = (e) => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    if (editingItem) {
      try {
        await InventoryAPI.updateProduct({
          sku: editForm.sku,
          name: editForm.name,
          quantity: parseInt(editForm.quantity, 10) || 0,
          price: parseFloat(editForm.price) || 0,
          location: editForm.location,
          threshold: parseInt(editForm.threshold, 10) || 20,
        });
        setEditingItem(null);
        fetchItems();
      } catch (err) {
        alert("Failed to update: " + err.message);
      }
    }
  };

  const handleDelete = async (sku) => {
    if (!window.confirm(`Delete product ${sku}?`)) return;
    try {
      await InventoryAPI.deleteProduct(sku);
      setOpenMenu(null);
      fetchItems();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const filteredItems = localFilter
    ? items.filter(i =>
        (i.name && i.name.toLowerCase().includes(localFilter.toLowerCase())) ||
        (i.sku && i.sku.toLowerCase().includes(localFilter.toLowerCase()))
      )
    : items;

  const getStatusBadge = (item) => {
    const status = item.stockStatus || (item.quantity === 0 ? "OUT_OF_STOCK" : item.quantity < 50 ? "LOW_STOCK" : "IN_STOCK");
    const map = {
      "IN_STOCK": { label: "In Stock", cls: "success" },
      "LOW_STOCK": { label: "Low Stock", cls: "delayed" },
      "OUT_OF_STOCK": { label: "Out of Stock", cls: "error" },
    };
    const s = map[status] || map["IN_STOCK"];
    return <span className={`status-badge ${s.cls}`}>{s.label}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Inventory</h2>
          <p>Manage and monitor stock levels across all locations.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>add</span>
            Add Product
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card" style={{ padding: "0.75rem 1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", border: "1px solid var(--surface-container-high)", borderRadius: "var(--radius-md)", padding: "0.5rem 0.75rem" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem", color: "var(--outline)", marginRight: "0.5rem" }}>search</span>
          <input
            type="text"
            placeholder="Filter by Product Name or SKU..."
            value={localFilter}
            onChange={(e) => setLocalFilter(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "0.875rem", color: "var(--on-surface)" }}
          />
        </div>
        <select
          className="form-input"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          style={{ width: "auto", minWidth: "140px", fontSize: "0.875rem" }}>
          <option value="ALL">All Stock</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <div className="spinner spinner-lg" />
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>PRODUCT DETAILS</th>
                  <th>SKU</th>
                  <th>QUANTITY</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "var(--on-surface-variant)" }}>
                      {searchQuery || localFilter ? "No products match your search." : "No products in inventory yet."}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.sku}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{
                            width: "2.25rem", height: "2.25rem", borderRadius: "var(--radius-sm)",
                            background: "var(--surface-container-low)", display: "flex",
                            alignItems: "center", justifyContent: "center", color: "var(--on-surface-variant)",
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>inventory_2</span>
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>
                        {item.sku}
                      </td>
                      <td style={{ fontWeight: 600, color: item.quantity === 0 ? "var(--error)" : "var(--on-surface)" }}>
                        {item.quantity?.toLocaleString()}
                      </td>
                      <td style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
                        {item.location}
                      </td>
                      <td>{getStatusBadge(item)}</td>
                      <td style={{ textAlign: "right", position: "relative" }}>
                        <button
                          className="btn-ghost"
                          onClick={() => setOpenMenu(openMenu === item.sku ? null : item.sku)}
                          style={{ padding: "0.25rem" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>more_vert</span>
                        </button>
                        {openMenu === item.sku && (
                          <div style={{
                            position: "absolute", right: 0, top: "100%", zIndex: 20,
                            background: "var(--surface-container-lowest)", border: "1px solid var(--surface-container-high)",
                            borderRadius: "var(--radius-md)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            minWidth: "140px", overflow: "hidden",
                          }}>
                            <button
                              onClick={() => handleEditClick(item)}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.625rem 1rem", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.875rem", color: "var(--on-surface)" }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>edit</span>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.sku)}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.625rem 1rem", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.875rem", color: "var(--error)" }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>delete</span>
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={page}
            totalPages={pageInfo.totalPages}
            totalElements={pageInfo.totalElements}
            pageSize={pageInfo.size}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <h3>Add New Product</h3>
            <p style={{ color: "var(--on-surface-variant)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
              Enter the product details to add to inventory.
            </p>
            {addError && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{addError}</div>}
            <div className="form-group">
              <label>Product Name</label>
              <input className="form-input" name="name" placeholder="e.g. Quantum Core Processor" value={addForm.name} onChange={handleAddChange} />
            </div>
            <div className="form-group">
              <label>SKU</label>
              <input className="form-input" name="sku" placeholder="e.g. EL-QC-8821" value={addForm.sku} onChange={handleAddChange} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Quantity</label>
                <input className="form-input" type="number" name="quantity" placeholder="0" value={addForm.quantity} onChange={handleAddChange} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input className="form-input" type="number" step="0.01" name="price" placeholder="0.00" value={addForm.price} onChange={handleAddChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="form-input" name="location" placeholder="e.g. Zone A - Shelf 12" value={addForm.location} onChange={handleAddChange} />
            </div>
            <div className="modal-actions" style={{ marginTop: "1.5rem" }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleAddSubmit} disabled={addLoading}>
                {addLoading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <h3>Edit Product</h3>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>SKU</label>
              <input className="form-input" name="sku" value={editForm.sku} disabled style={{ opacity: 0.6 }} />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input className="form-input" name="name" value={editForm.name} onChange={handleEditChange} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Quantity</label>
                <input className="form-input" type="number" name="quantity" value={editForm.quantity} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input className="form-input" type="number" step="0.01" name="price" value={editForm.price} onChange={handleEditChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="form-input" name="location" value={editForm.location} onChange={handleEditChange} />
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingItem(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryManagementPage;
