import React, { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = '34rem' }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        const dialog = dialogRef.current;
        const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        document.body.style.overflow = 'hidden';

        const getFocusable = () => Array.from(dialog?.querySelectorAll(focusableSelector) || []);
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab') return;

            const focusable = getFocusable();
            if (focusable.length === 0) {
                event.preventDefault();
                dialog?.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        (getFocusable()[0] || dialog)?.focus();
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            if (previousFocus instanceof HTMLElement) previousFocus.focus();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'color-mix(in srgb, var(--ink) 55%, transparent)',
                backdropFilter: 'blur(0.1875rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
                animation: 'fadeIn 0.15s ease-out',
                boxSizing: 'border-box'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                ref={dialogRef}
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
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ink)', margin: 0 }}>
                            {title}
                        </h3>
                        {subtitle && (
                            <p style={{ fontSize: '0.95rem', color: 'var(--ink-2)', marginTop: '0.25rem', margin: 0 }}>
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
                            width: '2.75rem',
                            height: '2.75rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.125rem',
                            color: 'var(--ink)',
                            cursor: 'pointer'
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '1.5rem' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
