import React from 'react';
import { useAuth } from '../context/AuthContext';

const roleDescriptions = {
  OWNER: { label: 'Owner', pages: 'All pages', defaultPage: 'dashboard' },
  ADMIN: { label: 'Admin', pages: 'All pages', defaultPage: 'dashboard' },
  MANAGER: { label: 'Manager', pages: 'Dashboard, Orders, Inventory, Warehouse', defaultPage: 'dashboard' },
  SALES: { label: 'Sales', pages: 'Orders', defaultPage: 'orders' },
  WORKER: { label: 'Worker', pages: 'Warehouse', defaultPage: 'warehouse-operations' },
};

function AccessDenied({ onNavigate }) {
  const { user } = useAuth();
  const rawRole = (user?.role || '').replace('ROLE_', '');
  const desc = roleDescriptions[rawRole] || roleDescriptions.WORKER;

  return (
    <div className="empty-state" style={{ paddingTop: '3rem' }}>
      <div
        style={{
          width: '4.5rem',
          height: '4.5rem',
          borderRadius: '50%',
          background: 'rgba(186, 26, 26, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '2.25rem', color: 'var(--error)' }}>
          lock
        </span>
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Access Denied
      </h3>
      <p style={{ maxWidth: '420px', margin: '0 auto', lineHeight: 1.6, color: 'var(--on-surface-variant)' }}>
        Your role <strong style={{ color: 'var(--on-surface)' }}>{desc.label}</strong> does not
        have permission to view this page.
      </p>
      <div
        className="card"
        style={{
          maxWidth: '360px',
          margin: '1.5rem auto',
          padding: '1.25rem 1.5rem',
          textAlign: 'left',
        }}>
        <p
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--outline)',
            marginBottom: '0.75rem',
          }}>
          You can access
        </p>
        <p style={{ fontWeight: 500, color: 'var(--on-surface)' }}>{desc.pages}</p>
      </div>
      <button
        className="btn btn-primary"
        style={{ marginTop: '0.5rem' }}
        onClick={() => onNavigate(desc.defaultPage || 'dashboard')}>
        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
          arrow_back
        </span>
        Go Back
      </button>
    </div>
  );
}

export default AccessDenied;
