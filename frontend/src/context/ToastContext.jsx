import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 7);
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div style={{
                position: 'fixed',
                bottom: 'var(--gutter)',
                right: 'var(--gutter)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                pointerEvents: 'none',
                maxWidth: '26.25rem',
                width: 'calc(100vw - 2 * var(--gutter))'
            }}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        style={{
                            pointerEvents: 'auto',
                            padding: '0.875rem 1rem',
                            borderRadius: 'var(--radius-control)',
                            background: toast.type === 'error' ? 'var(--alert)' : (toast.type === 'info' ? 'var(--safe)' : 'var(--brand)'),
                            color: 'var(--brand-contrast)',
                            boxShadow: 'var(--shadow)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            animation: 'slideInToast 0.25s ease-out',
                            border: '1px solid var(--line)'
                        }}
                    >
                        <span>{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            style={{
                                width: '2.75rem',
                                minHeight: '2.75rem',
                                flex: '0 0 auto',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--brand-contrast)',
                                cursor: 'pointer',
                                fontSize: '1.125rem',
                                padding: 0,
                                opacity: 0.8
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
