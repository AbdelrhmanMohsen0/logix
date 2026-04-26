/**
 * Shared password validation utility for LogiX.
 * Requirements: 8+ chars, uppercase, lowercase, number, special char.
 */

export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$%^&*(),.?":{}|<>_-)', test: (p) => /[!@#$%^&*(),.?":{}|<>_-]/.test(p) },
];

/**
 * Returns an array of error message strings for rules that fail.
 */
export function validatePassword(password) {
  return PASSWORD_RULES
    .filter((rule) => !rule.test(password))
    .map((rule) => rule.label);
}

/**
 * Returns a strength descriptor: 'weak' | 'medium' | 'strong'
 */
export function getPasswordStrength(password) {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  if (passed <= 2) return 'weak';
  if (passed <= 4) return 'medium';
  return 'strong';
}

const strengthColors = {
  weak: 'var(--error)',
  medium: '#e8a317',
  strong: '#2e7d32',
};

const strengthWidths = {
  weak: '33%',
  medium: '66%',
  strong: '100%',
};

/**
 * A React component that displays password requirements and a strength bar.
 * Usage: <PasswordRequirements password={passwordValue} />
 */
export function PasswordRequirements({ password }) {
  if (!password) return null;
  const strength = getPasswordStrength(password);

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {/* Strength bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{
          flex: 1,
          height: '4px',
          borderRadius: '2px',
          background: 'var(--surface-container-high)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: strengthWidths[strength] || '0%',
            background: strengthColors[strength] || 'transparent',
            borderRadius: '2px',
            transition: 'width 0.3s ease, background 0.3s ease',
          }} />
        </div>
        <span style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: strengthColors[strength] || 'var(--outline)',
          minWidth: '3.5rem',
        }}>
          {strength || ''}
        </span>
      </div>

      {/* Requirements checklist */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <li
              key={rule.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: passed ? '#2e7d32' : 'var(--outline)',
                marginBottom: '0.125rem',
                transition: 'color 0.2s ease',
              }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '0.875rem' }}>
                {passed ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
