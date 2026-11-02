import React, { useState, useEffect } from 'react';

const AdminDash = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalFarmers: 0,
        activeMarketplaceItems: 0,
        blockchainSettlements: 0
    });

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdminStats();
        fetchAllListings();
    }, []);

    const fetchAdminStats = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/dashboard');

            if (!res.ok) {
                throw new Error('Failed to fetch admin statistics');
            }

            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Error pulling admin statistics:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllListings = async () => {
        try {
            setListingsLoading(true);
            setError('');

            const res = await fetch('http://localhost:5000/api/farmer/items/all');

            if (!res.ok) {
                throw new Error('Failed to fetch crop listings');
            }

            const data = await res.json();
            setListings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching marketplace listings:", err);
            setError(err.message);
        } finally {
            setListingsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('agriUser');
        window.location.href = '/login';
    };

    const activeListings = listings.filter(
        item => item.status === 'Available'
    ).length;

    if (loading) return <h2 style={{ padding: '30px' }}>Loading dashboard...</h2>;

    return (
        <div style={{ padding: '30px', background: '#f0f4f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            {/* Header with Logout Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: '#287a35', margin: 0 }}>AgriTradeChain Admin Dashboard</h2>
                    <p style={{ color: '#555', margin: '5px 0 0 0' }}>System Management Oversight Console</p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        background: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Logout
                </button>
            </div>

            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ccc' }} />

            <h3>Platform Overview</h3>

            {/* Statistics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginTop: '25px'
            }}>
                <StatCard title="Total Customers" value={stats.totalCustomers} bgColor="#e3f2fd" borderColor="#90caf9" textColor="#0d47a1" />
                <StatCard title="Total Farmers" value={stats.totalFarmers} bgColor="#e8f5e9" borderColor="#a5d6a7" textColor="#1b5e20" />
                <StatCard title="Active Crop Listings" value={stats.activeMarketplaceItems} bgColor="#fff3e0" borderColor="#ffcc80" textColor="#e65100" />
                <StatCard title="Blockchain Settlements" value={stats.bloc} bgColor="#f3e5f5" borderColor="#ce93d8" textColor="#4a148c" />
            </div>

            {/* Marketplace Crop Listings List management section */}
            <section style={{
                marginTop: '35px',
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                border: '1px solid #ddd'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '15px'
                }}>
                    <h2 style={{ color: '#333', margin: 0 }}>Marketplace Crop Listings</h2>
                    <button
                        onClick={fetchAllListings}
                        style={{
                            padding: '8px 15px',
                            background: '#287a35',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Refresh Listings
                    </button>
                </div>

                {listingsLoading ? (
                    <p>Loading crop listings...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : listings.length === 0 ? (
                    <p>No listings found in the marketplace system.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Crop Type</th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Quantity</th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Price (Wei)</th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map((item, idx) => (
                                    <tr key={item._id || idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{item.cropType}</td>
                                        <td style={{ padding: '12px' }}>{item.quantity} kg</td>
                                        <td style={{ padding: '12px' }}>
                                            {item.priceInEth ? `${item.priceInEth} ETH` : 'Price not available'}
                                        </td>                                        <td style={{ padding: '12px' }}>
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
            </section>
        </div>
    );
};

// Reusable Custom Styled StatCard Component
function StatCard({ title, value, bgColor, borderColor, textColor }) {
    return (
        <div style={{
            background: bgColor || 'white',
            padding: '25px',
            borderRadius: '10px',
            border: `1px solid ${borderColor || '#ddd'}`,
            boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
        }}>
            <h3 style={{ color: '#555', margin: '0 0 10px 0', fontSize: '1.1rem' }}>{title}</h3>
            <h1 style={{ color: textColor || '#287a35', margin: 0, fontSize: '2.2rem' }}>{value}</h1>
        </div>
    );
}

export default AdminDash;
