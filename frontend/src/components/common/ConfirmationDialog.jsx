import React from 'react';
import Modal from './Modal';

const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false,
    loading = false
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="460px">
            <p style={{ color: 'var(--ink-2)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
                {message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    className={isDanger ? 'btn-danger' : 'btn-primary'}
                    onClick={onConfirm}
                    disabled={loading}
                    style={{ minWidth: '110px' }}
                >
                    {loading ? 'Processing...' : confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmationDialog;
