import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = '550px' }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '16px',
                animation: 'fadeIn 0.15s ease-out',
                boxSizing: 'border-box'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--line)',
                    width: '100%',
                    maxWidth,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box'
                }}
            >
                {/* Modal Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ink)', margin: 0 }}>
                            {title}
                        </h3>
                        {subtitle && (
                            <p style={{ fontSize: '0.95rem', color: 'var(--ink-2)', marginTop: '4px', margin: 0 }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            background: 'var(--surface-2)',
                            border: '1px solid var(--line)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            color: 'var(--ink)',
                            cursor: 'pointer'
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '24px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
