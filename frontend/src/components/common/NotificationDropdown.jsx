import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const NotificationDropdown = () => {
    const { user, apiFetch } = useAuth();
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (user?.id) params.append('userId', user.id);
            if (user?.role) params.append('role', user.role);

            const res = await apiFetch(`/notifications?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (err) {
            console.error('Failed to load notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user?.id, user?.role]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleMarkAsRead = async (id) => {
        try {
            const res = await apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
            if (res.ok) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const res = await apiFetch('/notifications/read-all', {
                method: 'PUT',
                body: JSON.stringify({ userId: user?.id, role: user?.role })
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
                showToast('All notifications marked as read', 'info');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const formatTimestamp = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return d.toLocaleDateString();
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'order_new': return '📦';
            case 'purchase_success': return '🌾';
            case 'payment_confirmed': return '💰';
            case 'delivery_update': return '🚚';
            case 'escrow_release': return '✅';
            case 'listing_new': return '🌱';
            default: return '🔔';
        }
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="View notifications"
                style={{
                    background: isOpen ? 'var(--surface-2)' : 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    color: 'var(--ink)',
                    transition: 'all 0.15s ease'
                }}
                title="Notifications"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        background: 'var(--alert)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: '800',
                        borderRadius: 'var(--radius-pill)',
                        minWidth: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 4px',
                        border: '2px solid var(--surface)'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '52px',
                    right: 0,
                    width: '380px',
                    maxWidth: 'calc(100vw - 32px)',
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-card)',
                    boxShadow: 'var(--shadow)',
                    border: '1px solid var(--line)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease-out'
                }}>
                    <div style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--line)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--surface-2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>Notifications</strong>
                            {unreadCount > 0 && (
                                <span style={{
                                    background: 'var(--done-bg)',
                                    color: 'var(--done)',
                                    fontSize: '0.9rem',
                                    fontWeight: '800',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-pill)',
                                    border: '1px solid var(--done)'
                                }}>
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--brand)',
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        {loading && notifications.length === 0 ? (
                            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--ink-3)', fontSize: '0.95rem' }}>
                                Loading notifications...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-3)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🌱</div>
                                <p style={{ fontSize: '0.95rem' }}>No notifications right now</p>
                            </div>
                        ) : (
                            notifications.map(item => (
                                <div
                                    key={item._id}
                                    style={{
                                        padding: '14px 18px',
                                        borderBottom: '1px solid var(--line)',
                                        background: item.isRead ? 'var(--surface)' : 'var(--surface-2)',
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '1.3rem',
                                        background: item.isRead ? 'var(--surface-2)' : 'var(--brand-subtle)',
                                        padding: '8px',
                                        borderRadius: 'var(--radius-control)',
                                        lineHeight: 1
                                    }}>
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                            <strong style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>
                                                {item.title}
                                            </strong>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
                                                {formatTimestamp(item.createdAt)}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.92rem', color: 'var(--ink-2)', marginTop: '4px', lineHeight: 1.4 }}>
                                            {item.message}
                                        </p>
                                        {!item.isRead && (
                                            <button
                                                type="button"
                                                onClick={() => handleMarkAsRead(item._id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--brand)',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    marginTop: '6px',
                                                    padding: 0
                                                }}
                                            >
                                                Mark read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
