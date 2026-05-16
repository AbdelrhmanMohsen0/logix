import React from 'react';

function Pagination({ currentPage, totalPages, totalElements, pageSize, onPageChange }) {
  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible);
    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 1.5rem",
      borderTop: "1px solid var(--surface-container)",
      fontSize: "0.8125rem",
      color: "var(--on-surface-variant)",
    }}>
      <div>
        Showing {startItem} to {endItem} of {totalElements} entries
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          style={{
            border: "1px solid var(--surface-container-high)",
            background: "transparent",
            borderRadius: "var(--radius-sm)",
            padding: "0.375rem 0.5rem",
            cursor: currentPage === 0 ? "not-allowed" : "pointer",
            opacity: currentPage === 0 ? 0.4 : 1,
            color: "var(--on-surface)",
            fontSize: "0.8125rem",
          }}>
          ‹
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              border: page === currentPage ? "1px solid var(--primary)" : "1px solid var(--surface-container-high)",
              background: page === currentPage ? "var(--primary)" : "transparent",
              color: page === currentPage ? "#fff" : "var(--on-surface)",
              borderRadius: "var(--radius-sm)",
              padding: "0.375rem 0.625rem",
              cursor: "pointer",
              fontWeight: page === currentPage ? 600 : 400,
              fontSize: "0.8125rem",
              minWidth: "2rem",
            }}>
            {page + 1}
          </button>
        ))}
        {totalPages > 5 && currentPage < totalPages - 3 && (
          <span style={{ padding: "0 0.25rem" }}>…</span>
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          style={{
            border: "1px solid var(--surface-container-high)",
            background: "transparent",
            borderRadius: "var(--radius-sm)",
            padding: "0.375rem 0.5rem",
            cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
            opacity: currentPage >= totalPages - 1 ? 0.4 : 1,
            color: "var(--on-surface)",
            fontSize: "0.8125rem",
          }}>
          ›
        </button>
      </div>
    </div>
  );
}

export default Pagination;
