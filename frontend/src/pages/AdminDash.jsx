import React, { useState, useEffect } from 'react';

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

    const activeListings = listings.filter(
        item => item.status === 'Available'
    ).length;

    if (loading) {
        return <h2 style={{ padding: '30px' }}>Loading dashboard...</h2>;
    }

    return (
        <div style={{
            padding: '30px',
            background: '#f0f4f0',
            minHeight: '100vh',
            fontFamily: 'sans-serif'
        }}>
            {/* Dashboard Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div>
                    <h2 style={{ color: '#287a35', margin: 0 }}>
                        AgriTradeChain Admin Dashboard
                    </h2>
                    <p style={{ color: '#555', margin: '5px 0 0 0' }}>
                        System Management Oversight Console
                    </p>
                </div>

                <button onClick={handleLogout} style={buttonStyle('#d32f2f')}>
                    Logout
                </button>
            </div>

            <hr style={{
                margin: '20px 0',
                border: 0,
                borderTop: '1px solid #ccc'
            }} />

            <h3>Platform Overview</h3>

            {/* Statistics Cards */}
            {statsError && (
                <p style={{ color: '#c62828' }}>
                    Could not load dashboard statistics: {statsError}
                    <button
                        onClick={fetchAdminStats}
                        style={{ marginLeft: '10px' }}
                    >
                        Retry
                    </button>
                </p>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginTop: '25px'
            }}>
                <StatCard title="Total Customers" value={stats.totalCustomers} bgColor="#e3f2fd" borderColor="#90caf9" textColor="#0d47a1" />
                <StatCard title="Total Farmers" value={stats.totalFarmers} bgColor="#e8f5e9" borderColor="#a5d6a7" textColor="#1b5e20" />
                <StatCard title="Active Crop Listings" value={stats.activeMarketplaceItems} bgColor="#fff3e0" borderColor="#ffcc80" textColor="#e65100" />
                <StatCard title="Blockchain Settlements" value={stats.blockchainSettlements} bgColor="#f3e5f5" borderColor="#ce93d8" textColor="#4a148c" />
            </div>

            {/* Marketplace Crop Listings */}
            <section style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>Marketplace Crop Listings</h2>
                    <button onClick={fetchAllListings} style={buttonStyle('#287a35')}>
                        Refresh Listings
                    </button>
                </div>

                {listingsLoading ? (
                    <p>Loading crop listings...</p>
                ) : listingsError ? (
                    <ErrorMessage message={listingsError} onRetry={fetchAllListings} />
                ) : listings.length === 0 ? (
                    <p>No listings found in the marketplace system.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableHeaderStyle}>
                                    <th style={cellStyle}>Crop Type</th>
                                    <th style={cellStyle}>Quantity</th>
                                    <th style={cellStyle}>Price (ETH)</th>
                                    <th style={cellStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map((item, idx) => (
                                    <tr key={item._id || idx} style={tableRowStyle}>
                                        <td style={cellStyle}>{item.cropType || 'N/A'}</td>
                                        <td style={cellStyle}>
                                            {item.quantity != null ? `${item.quantity} kg` : 'N/A'}
                                        </td>
                                        <td style={cellStyle}>
                                            {item.priceInEth != null
                                                ? `${item.priceInEth} ETH`
                                                : 'Price not available'}
                                        </td>
                                        <td style={cellStyle}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                background: item.status === 'Available' ? '#e8f5e9' : '#ffebee',
                                                color: item.status === 'Available' ? '#2e7d32' : '#c62828'
                                            }}>
                                                {item.status || 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <p style={{ color: '#777', fontSize: '0.85rem', marginBottom: 0 }}>
                    Available listings shown in statistics: {activeListings}
                </p>
            </section>

            {/* Farmer Management */}
            <section style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>Farmer Management</h2>
                    <button onClick={fetchAllFarmers} style={buttonStyle('#287a35')}>
                        Refresh Farmers
                    </button>
                </div>

                {farmersLoading ? (
                    <p>Loading farmers...</p>
                ) : farmersError ? (
                    <ErrorMessage message={farmersError} onRetry={fetchAllFarmers} />
                ) : farmers.length === 0 ? (
                    <p>No farmers registered yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableHeaderStyle}>
                                    <th style={cellStyle}>Name</th>
                                    <th style={cellStyle}>Email</th>
                                    <th style={cellStyle}>Wallet Address</th>
                                    <th style={cellStyle}>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {farmers.map(farmer => (
                                    <tr
                                        key={farmer._id}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`View details for ${farmer.name || 'farmer'}`}
                                        onClick={() => setSelectedFarmer(farmer)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                setSelectedFarmer(farmer);
                                            }
                                        }}
                                        style={{ ...clickableRowStyle, textAlign: 'left' }}
                                    >
                                        <td style={cellStyle}>{farmer.name || 'N/A'}</td>
                                        <td style={cellStyle}>{farmer.email || 'N/A'}</td>
                                        <td style={{ ...cellStyle, wordBreak: 'break-all' }}>
                                            {farmer.walletAddress || 'N/A'}
                                        </td>
                                        <td style={cellStyle}>{farmer.location || 'Not provided'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <p style={{ color: '#777', fontSize: '0.85rem' }}>
                    Select a farmer's row to view more information.
                </p>
            </section>

            {/* Customer Management */}
            <section style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>Customer Management</h2>
                    <button onClick={fetchAllCustomers} style={buttonStyle('#287a35')}>
                        Refresh Customers
                    </button>
                </div>

                {customersLoading ? (
                    <p>Loading customers...</p>
                ) : customersError ? (
                    <ErrorMessage message={customersError} onRetry={fetchAllCustomers} />
                ) : customers.length === 0 ? (
                    <p>No customers registered yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableHeaderStyle}>
                                    <th style={cellStyle}>Name</th>
                                    <th style={cellStyle}>Email</th>
                                    <th style={cellStyle}>Wallet Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map(customer => (
                                    <tr
                                        key={customer._id}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`View details for ${customer.name || 'customer'}`}
                                        onClick={() => setSelectedCustomer(customer)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                setSelectedCustomer(customer);
                                            }
                                        }}
                                        style={{ ...clickableRowStyle, textAlign: 'left' }}
                                    >
                                        <td style={cellStyle}>{customer.name || 'N/A'}</td>
                                        <td style={cellStyle}>{customer.email || 'N/A'}</td>
                                        <td style={{ ...cellStyle, wordBreak: 'break-all' }}>
                                            {customer.walletAddress || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <p style={{ color: '#777', fontSize: '0.85rem' }}>
                    Select a customer's row to view more information.
                </p>
            </section>

            {/* Farmer Details Modal */}
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

            {/* Customer Details Modal */}
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
            {/* Order Management & Settlements */}
            <section style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>Order Management & Settlements</h2>
                    <button onClick={fetchAllOrders} style={buttonStyle('#287a35')}>
                        Refresh Orders
                    </button>
                </div>

                {ordersLoading ? (
                    <p>Loading transactions...</p>
                ) : ordersError ? (
                    <ErrorMessage message={ordersError} onRetry={fetchAllOrders} />
                ) : orders.length === 0 ? (
                    <p>No orders or blockchain settlements recorded yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableHeaderStyle}>
                                    <th style={cellStyle}>Customer</th>
                                    <th style={cellStyle}>Farmer</th>
                                    <th style={cellStyle}>Crop Item</th>
                                    <th style={cellStyle}>Tx Hash</th>
                                    <th style={cellStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                        <td style={cellStyle}>
                                            <strong>{order.customer?.name || 'N/A'}</strong><br />
                                            <span style={{ fontSize: '0.8rem', color: '#666' }}>{order.customer?.email || 'N/A'}</span>
                                        </td>
                                        <td style={cellStyle}>
                                            <strong>{order.farmer?.name || 'N/A'}</strong><br />
                                            <span style={{ fontSize: '0.8rem', color: '#666' }}>{order.farmer?.location || 'Not provided'}</span>
                                        </td>
                                        <td style={cellStyle}>
                                            {order.item?.cropType || 'Deleted Item'}<br />
                                            <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                                {order.item?.quantity != null ? `${order.item.quantity} kg` : 'Quantity unavailable'}
                                            </span>
                                        </td>
                                        <td style={{ ...cellStyle, wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.85rem', maxWidth: '180px' }}>
                                            {order.transactionHash || 'N/A'}
                                        </td>
                                        <td style={cellStyle}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                background: order.status === 'Delivered' || order.status === 'Completed' ? '#e8f5e9' : '#fff3e0',
                                                color: order.status === 'Delivered' || order.status === 'Completed' ? '#2e7d32' : '#e65100',
                                                fontWeight: 'bold'
                                            }}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>


        </div>
    );
};

function DetailsModal({ title, name, subtitle, fields, onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '15px',
                boxSizing: 'border-box'
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={event => event.stopPropagation()}
                style={{
                    background: 'white',
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    borderRadius: '12px',
                    padding: '25px',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '15px'
                }}>
                    <h2 style={{ color: '#287a35', margin: 0 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close details"
                        style={{
                            border: 'none',
                            background: 'transparent',
                            fontSize: '25px',
                            cursor: 'pointer'
                        }}
                    >
                        &times;
                    </button>
                </div>

                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{
                        width: '75px',
                        height: '75px',
                        borderRadius: '50%',
                        background: '#e5f3e5',
                        color: '#287a35',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '30px',
                        fontWeight: 'bold',
                        margin: 'auto'
                    }}>
                        {(name || '?').charAt(0).toUpperCase()}
                    </div>
                    <h3 style={{ marginBottom: '5px' }}>{name || 'N/A'}</h3>
                    <p style={{ color: '#777', margin: 0 }}>{subtitle}</p>
                </div>

                <h3 style={{
                    borderBottom: '1px solid #eee',
                    paddingBottom: '10px'
                }}>
                    Personal Information
                </h3>

                {fields.map(([label, value]) => (
                    <div
                        key={label}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '15px',
                            padding: '12px 0',
                            borderBottom: '1px solid #f0f0f0'
                        }}
                    >
                        <strong>{label}</strong>
                        <span style={{
                            color: '#555',
                            textAlign: 'right',
                            wordBreak: 'break-word'
                        }}>
                            {value || 'Not available'}
                        </span>
                    </div>
                ))}

                <button
                    onClick={onClose}
                    style={{
                        ...buttonStyle('#287a35'),
                        width: '100%',
                        marginTop: '20px'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

function ErrorMessage({ message, onRetry }) {
    return (
        <div>
            <p style={{ color: '#c62828' }}>{message}</p>
            <button onClick={onRetry} style={buttonStyle('#555')}>
                Retry
            </button>
        </div>
    );
}

function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

const sectionStyle = {
    marginTop: '35px',
    padding: '20px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
    border: '1px solid #ddd'
};

const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '15px'
};

const sectionTitleStyle = {
    color: '#333',
    margin: 0
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
};

const tableHeaderStyle = {
    background: '#f5f5f5',
    textAlign: 'left'
};

const cellStyle = {
    padding: '12px',
    borderBottom: '1px solid #eee',
    textAlign: 'left',
    verticalAlign: 'top'
};

const tableRowStyle = {
    borderBottom: '1px solid #eee'
};

const clickableRowStyle = {
    cursor: 'pointer',
    transition: 'background 0.2s'
};

function buttonStyle(background) {
    return {
        padding: '9px 15px',
        background,
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    };
}

// Reusable statistics card
function StatCard({ title, value, bgColor, borderColor, textColor }) {
    return (
        <div style={{
            background: bgColor || 'white',
            padding: '25px',
            borderRadius: '10px',
            border: `1px solid ${borderColor || '#ddd'}`,
            boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
        }}>
            <h3 style={{
                color: '#555',
                margin: '0 0 10px 0',
                fontSize: '1.1rem'
            }}>
                {title}
            </h3>
            <h1 style={{
                color: textColor || '#287a35',
                margin: 0,
                fontSize: '2.2rem'
            }}>
                {value}
            </h1>
        </div>
    );
}

export default AdminDash;
