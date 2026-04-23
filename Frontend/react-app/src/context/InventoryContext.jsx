import React, { createContext, useContext, useState, useCallback } from 'react';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([
    {
      sku: "ELEC-001",
      name: "Wireless Keyboard",
      qty: 154,
      loc: "Zone A - A12",
      updated: "2025-10-25T10:00:00Z",
      price: 79.99,
      icon: "keyboard",
    },
    {
      sku: "OFF-010",
      name: "Ergonomic Chair",
      qty: 28,
      loc: "Zone C - C04",
      updated: "2025-10-24T14:30:00Z",
      price: 129.99,
      icon: "chair",
    },
    {
      sku: "STAT-005",
      name: "Notebook Bundle",
      qty: 450,
      loc: "Zone B - B02",
      updated: "2025-10-25T09:15:00Z",
      price: 49.99,
      icon: "book",
    },
    {
      sku: "LOG-QFR-902",
      name: "Quantum Flux Regulator",
      qty: 45,
      loc: "Zone D - D11",
      updated: "2025-10-25T11:00:00Z",
      price: 149.99,
      icon: "tune",
    },
    {
      sku: "LOG-HLP-114",
      name: "High-Load Piston Unit",
      qty: 120,
      loc: "Zone D - D12",
      updated: "2025-10-25T11:30:00Z",
      price: 89.50,
      icon: "precision_manufacturing",
    },
    {
      sku: "LOG-KIM-552",
      name: "Kinetic Interface Module",
      qty: 8,
      loc: "Zone D - D13",
      updated: "2025-10-25T12:00:00Z",
      price: 299.99,
      icon: "memory",
    },
  ]);

  const updateInventoryItem = useCallback((originalSku, newValues) => {
    setItems((prevItems) => {
      const idx = prevItems.findIndex(i => i.sku === originalSku);
      if (idx === -1) return prevItems;
      
      const newItems = [...prevItems];
      newItems[idx] = {
        ...newItems[idx],
        ...newValues,
        updated: new Date().toISOString(),
      };
      return newItems;
    });
  }, []);

  return (
    <InventoryContext.Provider value={{ items, updateInventoryItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
