import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from './Container';
import ThemeToggle from '../ThemeToggle';
import NotificationDropdown from '../common/NotificationDropdown';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { connectWallet, isMetaMaskInstalled, shortenHash } from '../../utils/web3';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [walletAddress, setWalletAddress] = useState(user?.walletAddress || '');
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        if (user?.walletAddress) {
            setWalletAddress(user.walletAddress);
        }

        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts && accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                    }
                })
                .catch(() => {});

            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    showToast(`Wallet connected: ${shortenHash(accounts[0])}`, 'info');
                } else {
                    setWalletAddress('');
                }
            };

            window.ethereum.on?.('accountsChanged', handleAccountsChanged);
            return () => {
                window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
            };
        }
    }, [user?.walletAddress]);

    const handleConnectWallet = async () => {
        if (!isMetaMaskInstalled()) {
            showToast('MetaMask is not installed. Please install the browser extension.', 'error');
            return;
        }

        try {
            setConnecting(true);
            const conn = await connectWallet();
            setWalletAddress(conn.address);
            showToast(`Connected: ${shortenHash(conn.address)}`, 'success');
        } catch (err) {
            console.error('Wallet connect error:', err);
            showToast(err.message || 'Failed to connect MetaMask', 'error');
        } finally {
            setConnecting(false);
        }
    };

    const getDashboardPath = () => {
        if (!user) return '/login';
        if (user.role?.toLowerCase() === 'farmer') return '/farmer/dashboard';
        if (user.role?.toLowerCase() === 'admin') return '/admin/dashboard';
        return '/customer/dashboard';
    };

    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 900,
                height: '72px',
                paddingTop: 'env(safe-area-inset-top, 0px)',
                background: 'var(--surface)',
                borderBottom: '1px solid var(--line)',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                {/* 1. Logo & Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link
                        to="/"
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-control)',
                            background: 'var(--brand)',
                            color: 'var(--brand-contrast)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            fontWeight: '800'
                        }}>
                            🌾
                        </div>
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '800',
                            color: 'var(--ink)',
                            letterSpacing: '-0.02em'
                        }}>
                            AgriTrade<span style={{ color: 'var(--accent)' }}>Chain</span>
                        </span>
                    </Link>

                    {/* 2. Marketplace Link */}
                    <Link
                        to="/marketplace"
                        className="nav-link"
                        style={{
                            color: 'var(--ink-2)',
                            textDecoration: 'none',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-control)',
                            transition: 'color 0.15s'
                        }}
                    >
                        Marketplace
                    </Link>

                    {/* 3. Portal Badge (if authenticated) */}
                    {isAuthenticated && user?.role && (
                        <Link
                            to={getDashboardPath()}
                            style={{
                                textDecoration: 'none',
                                background: 'var(--brand-subtle)',
                                color: 'var(--brand)',
                                border: '1px solid var(--brand)',
                                padding: '4px 12px',
                                borderRadius: 'var(--radius-pill)',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span>{user.role}</span>
                        </Link>
                    )}
                </div>

                {/* Right controls: ThemeToggle | wallet chip | notifications | user | logout */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* 4. ThemeToggle (always visible, placed immediately to the left of the wallet chip) */}
                    <ThemeToggle />

                    {/* 5. Wallet Chip */}
                    {walletAddress ? (
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                minHeight: '44px',
                                padding: '0 14px',
                                borderRadius: 'var(--radius-control)',
                                background: 'var(--surface-2)',
                                border: '1px solid var(--line)',
                                color: 'var(--ink)',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                fontFamily: 'var(--font-mono)'
                            }}
                            title={`Connected wallet: ${walletAddress}`}
                        >
                            <span style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: 'var(--done)',
                                flexShrink: 0
                            }} />
                            <span className="wallet-chip-text">
                                {shortenHash(walletAddress, 5, 4)}
                            </span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleConnectWallet}
                            disabled={connecting}
                            className="btn-secondary"
                            style={{ minHeight: '44px', padding: '0 14px', fontSize: '0.92rem' }}
                        >
                            🦊 <span className="wallet-chip-text">{connecting ? 'Connecting...' : 'Connect wallet'}</span>
                        </button>
                    )}

                    {/* 6. Notifications */}
                    {isAuthenticated && <NotificationDropdown />}

                    {/* 7. User & 8. Logout */}
                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-control)',
                                    background: 'var(--surface-2)'
                                }}
                                className="user-profile-badge"
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'var(--brand)',
                                    color: 'var(--brand-contrast)',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--ink)' }}>
                                    {user.name || user.email?.split('@')[0]}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                className="btn-secondary"
                                style={{
                                    minHeight: '44px',
                                    padding: '0 14px',
                                    color: 'var(--alert)',
                                    borderColor: 'var(--line)',
                                    fontSize: '0.92rem'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Link to="/login" className="btn-secondary" style={{ minHeight: '44px', padding: '0 16px', textDecoration: 'none' }}>
                                Sign in
                            </Link>
                            <Link to="/register" className="btn-primary" style={{ minHeight: '44px', padding: '0 16px', textDecoration: 'none' }}>
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </Container>

            {/* Responsive styles for wallet chip & user badge */}
            <style>{`
                @media (max-width: 640px) {
                    .wallet-chip-text {
                        display: none;
                    }
                    .user-profile-badge span {
                        display: none;
                    }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
