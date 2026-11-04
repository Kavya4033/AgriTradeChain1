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
        <header className="site-navbar">
            <Container className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="navbar-brand-mark" aria-hidden="true">🌾</span>
                    <span className="navbar-brand-copy">
                        <span className="navbar-wordmark">AgriTrade<span>Chain</span></span>
                        <span className="navbar-caption">DECENTRALIZED ESCROW</span>
                    </span>
                </Link>

                <details className="navbar-menu">
                    <summary className="navbar-menu-trigger" aria-label="Open navigation menu">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span>Menu</span>
                    </summary>

                    <div className="navbar-menu-content">
                        <nav className="navbar-links" aria-label="Main navigation">
                            <Link to="/marketplace" className="navbar-link">Marketplace</Link>
                            {isAuthenticated && user?.role && (
                                <Link to={getDashboardPath()} className="navbar-portal-badge">
                                    {user.role} Portal
                                </Link>
                            )}
                        </nav>

                        <div className="navbar-controls">
                            {walletAddress ? (
                                <div className="wallet-chip" title={`Connected wallet: ${walletAddress}`}>
                                    <span className="wallet-status-dot" aria-hidden="true" />
                                    <span className="wallet-chip-text">{shortenHash(walletAddress, 5, 4)}</span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleConnectWallet}
                                    disabled={connecting}
                                    className="btn-secondary wallet-connect-button"
                                >
                                    🦊 {connecting ? 'Connecting...' : 'Connect wallet'}
                                </button>
                            )}

                            {isAuthenticated && <NotificationDropdown />}

                            {isAuthenticated ? (
                                <div className="navbar-account-controls">
                                    <div className="navbar-user">
                                        <span className="navbar-avatar" aria-hidden="true">
                                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                        </span>
                                        <span className="navbar-user-copy">
                                            <strong>{user.name || user.email?.split('@')[0]}</strong>
                                            <span>{user.role}</span>
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            logout();
                                            navigate('/login');
                                        }}
                                        className="btn-secondary navbar-logout"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="navbar-auth-links">
                                    <Link to="/login" className="btn-secondary">Sign in</Link>
                                    <Link to="/register" className="btn-primary">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </details>

                <div className="navbar-theme-control">
                    <ThemeToggle />
                </div>
            </Container>
        </header>
    );
};

export default Navbar;
