import React from 'react';

const EmptyState = ({
    icon = '🌾',
    title = 'No items found',
    description = 'There are no records to display at this time.',
    actionLabel,
    onAction
}) => {
    return (
        <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px dashed var(--line)',
            margin: '16px 0',
            boxSizing: 'border-box'
        }}>
            <div style={{ fontSize: '3.2rem', marginBottom: '14px' }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ink)', marginBottom: '8px' }}>
                {title}
            </h3>
            <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                {description}
            </p>
            {actionLabel && onAction && (
                <button
                    type="button"
                    className="btn-primary"
                    onClick={onAction}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
