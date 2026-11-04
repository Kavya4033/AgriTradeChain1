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
            padding: '3rem 1.5rem',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px dashed var(--line)',
            margin: '1rem 0',
            boxSizing: 'border-box'
        }}>
            <div style={{ fontSize: '3.2rem', marginBottom: '0.875rem' }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ink)', marginBottom: '0.5rem' }}>
                {title}
            </h3>
            <p style={{ color: 'var(--ink-2)', fontSize: '1rem', maxWidth: '27.5rem', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
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
