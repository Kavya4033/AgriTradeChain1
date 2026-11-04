import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import AdminDashboardView from './AdminDashboardView';

const API_BASE = 'http://localhost:5000/api';

const AdminDash = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalFarmers: 0,
        activeMarketplaceItems: 0,
        blockchainSettlements: 0
    });

    const [farmers, setFarmers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [listings, setListings] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [farmersLoading, setFarmersLoading] = useState(true);
    const [customersLoading, setCustomersLoading] = useState(true);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);

    const [statsError, setStatsError] = useState('');
    const [farmersError, setFarmersError] = useState('');
    const [customersError, setCustomersError] = useState('');
    const [listingsError, setListingsError] = useState('');
    const [ordersError, setOrdersError] = useState('');

    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchAdminStats();
        fetchAllListings();
        fetchAllFarmers();
        fetchAllCustomers();
        fetchAllOrders();
    }, []);

    // Close an open details modal with the Escape key.
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSelectedFarmer(null);
                setSelectedCustomer(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const fetchAdminStats = async () => {
        try {
            setStatsError('');
            const res = await fetch(`${API_BASE}/admin/dashboard`);

            if (!res.ok) {
                throw new Error('Failed to fetch admin statistics');
            }

            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Error pulling admin statistics:', err);
            setStatsError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllListings = async () => {
        try {
            setListingsLoading(true);
            setListingsError('');

            const res = await fetch(`${API_BASE}/farmer/items/all`);

            if (!res.ok) {
                throw new Error('Failed to fetch crop listings');
            }

            const data = await res.json();
            setListings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching marketplace listings:', err);
            setListingsError(err.message);
        } finally {
            setListingsLoading(false);
        }
    };

    const fetchAllFarmers = async () => {
        try {
            setFarmersLoading(true);
            setFarmersError('');

            const res = await fetch(`${API_BASE}/admin/farmers`);

            if (!res.ok) {
                throw new Error('Failed to fetch farmers');
            }

            const data = await res.json();
            setFarmers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching farmers:', err);
            setFarmersError(err.message);
        } finally {
            setFarmersLoading(false);
        }
    };

    const fetchAllCustomers = async () => {
        try {
            setCustomersLoading(true);
            setCustomersError('');

            const res = await fetch(`${API_BASE}/admin/customers`);

            if (!res.ok) {
                throw new Error('Failed to fetch customers');
            }

            const data = await res.json();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setCustomersError(err.message);
        } finally {
            setCustomersLoading(false);
        }
    };

    const fetchAllOrders = async () => {
        try {
            setOrdersLoading(true);
            setOrdersError('');

            const res = await fetch(`${API_BASE}/admin/orders`);

            if (!res.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setOrdersError(err.message || 'Unable to fetch orders');
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('agriUser');
        window.location.href = '/login';
    };

    const refreshPlatformData = () => {
        fetchAdminStats();
        fetchAllListings();
        fetchAllFarmers();
        fetchAllCustomers();
        fetchAllOrders();
    };

    if (loading) {
        return <><Navbar /><h2 style={{ padding: '30px' }}>Loading dashboard...</h2></>;
    }

    return (
        <>
            <Navbar />
            <AdminDashboardView
                stats={stats}
                statsError={statsError}
                farmers={farmers}
                customers={customers}
                listings={listings}
                orders={orders}
                farmersLoading={farmersLoading}
                customersLoading={customersLoading}
                listingsLoading={listingsLoading}
                ordersLoading={ordersLoading}
                farmersError={farmersError}
                customersError={customersError}
                listingsError={listingsError}
                ordersError={ordersError}
                onRefreshAll={refreshPlatformData}
                onRefreshStats={fetchAdminStats}
                onRefreshFarmers={fetchAllFarmers}
                onRefreshCustomers={fetchAllCustomers}
                onRefreshListings={fetchAllListings}
                onRefreshOrders={fetchAllOrders}
                onSelectFarmer={setSelectedFarmer}
                onSelectCustomer={setSelectedCustomer}
                onLogout={handleLogout}
            />
            {selectedFarmer && (
                <DetailsModal
                    title="Farmer Details"
                    name={selectedFarmer.name}
                    subtitle="Registered Farmer"
                    onClose={() => setSelectedFarmer(null)}
                    fields={[
                        ['Full Name', selectedFarmer.name],
                        ['Email Address', selectedFarmer.email],
                        ['Phone Number', selectedFarmer.phone],
                        ['Location', selectedFarmer.location],
                        ['Wallet Address', selectedFarmer.walletAddress],
                        ['Farmer ID', selectedFarmer._id],
                        ['Registration Date', formatDate(selectedFarmer.createdAt)]
                    ]}
                />
            )}
            {selectedCustomer && (
                <DetailsModal
                    title="Customer Details"
                    name={selectedCustomer.name}
                    subtitle="Registered Customer"
                    onClose={() => setSelectedCustomer(null)}
                    fields={[
                        ['Full Name', selectedCustomer.name],
                        ['Email Address', selectedCustomer.email],
                        ['Wallet Address', selectedCustomer.walletAddress],
                        ['Customer ID', selectedCustomer._id],
                        ['Registration Date', formatDate(selectedCustomer.createdAt)]
                    ]}
                />
            )}
        </>
    );
};

function DetailsModal({ title, name, subtitle, fields, onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'color-mix(in srgb, var(--ink) 55%, transparent)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '1rem',
                boxSizing: 'border-box'
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={event => event.stopPropagation()}
                style={{
                    background: 'var(--surface)',
                    width: '100%',
                    maxWidth: '37.5rem',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-card)',
                    padding: '1.5rem',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: '0.9375rem'
                }}>
                    <h2 style={{ color: 'var(--brand)', margin: 0 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close details"
                        style={{
                            width: '2.75rem',
                            minHeight: '2.75rem',
                            border: '1px solid var(--line)',
                            borderRadius: '50%',
                            background: 'var(--surface-2)',
                            color: 'var(--ink)',
                            fontSize: '1.25rem',
                            cursor: 'pointer'
                        }}
                    >
                        &times;
                    </button>
                </div>

                <div style={{ textAlign: 'center', padding: '1.25rem' }}>
                    <div style={{
                        width: '4.5rem',
                        height: '4.5rem',
                        borderRadius: '50%',
                        background: 'var(--brand-subtle)',
                        color: 'var(--brand)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        margin: 'auto'
                    }}>
                        {(name || '?').charAt(0).toUpperCase()}
                    </div>
                    <h3 style={{ marginBottom: '0.3125rem' }}>{name || 'N/A'}</h3>
                    <p style={{ color: 'var(--ink-2)', margin: 0 }}>{subtitle}</p>
                </div>

                <h3 style={{
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: '0.625rem'
                }}>
                    Personal Information
                </h3>

                {fields.map(([label, value]) => (
                    <div
                        key={label}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '0.9375rem',
                            padding: '0.75rem 0',
                            borderBottom: '1px solid var(--line)'
                        }}
                    >
                        <strong>{label}</strong>
                        <span style={{
                            color: 'var(--ink-2)',
                            textAlign: 'right',
                            wordBreak: 'break-word'
                        }}>
                            {value || 'Not available'}
                        </span>
                    </div>
                ))}

                <button
                    onClick={onClose}
                    className="btn-secondary"
                    style={{ width: '100%', marginTop: '1.25rem' }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

export default AdminDash;
