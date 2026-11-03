import React from 'react';

const Panel = ({ title, subtitle, action, children, style = {}, className = '' }) => {
    return (
        <section
            className={`card-neutral ${className}`}
            style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--line)',
                boxShadow: 'var(--shadow)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                ...style
            }}
        >
            {(title || action) && (
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                    borderBottom: children ? '1px solid var(--line)' : 'none',
                    paddingBottom: children ? '16px' : '0'
                }}>
                    <div>
                        {title && (
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ink)', margin: 0 }}>
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p style={{ fontSize: '0.95rem', color: 'var(--ink-2)', marginTop: '4px', margin: 0 }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </section>
    );
};

export default Panel;
