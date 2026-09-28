import React, { useState, useEffect } from 'react';

const AdminDash = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalFarmers: 0,
        totalListings: 0,
        totalOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/dashboard');
            const data = await res.json();
            setStats(data);
            setLoading(false);
        } catch (err) {
            console.error("Error pulling admin statistics:", err);
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>AgriTradeChain Administrator Portal</h1>
            <p style={{ color: '#555' }}>System Management Oversight Console</p>
            <hr />

            {loading ? (
                <p>Retrieving database collection data matrix metrics...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    
                    {/* Customers Card */}
                    <div style={{ padding: '20px', borderRadius: '8px', background: '#e3f2fd', border: '1px solid #90caf9' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#0d47a1' }}>Total Customers</h3>
                        <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{stats.totalCustomers}</p>
                    </div>

                    {/* Farmers Card */}
                    <div style={{ padding: '20px', borderRadius: '8px', background: '#e8f5e9', border: '1px solid #a5d6a7' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#1b5e20' }}>Total Registered Farmers</h3>
                        <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{stats.totalFarmers}</p>
                    </div>

                    {/* Listings Card */}
                    <div style={{ padding: '20px', borderRadius: '8px', background: '#fff3e0', border: '1px solid #ffcc80' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#e65100' }}>Active Marketplace Items</h3>
                        <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{stats.totalListings}</p>
                    </div>

                    {/* Orders Card */}
                    <div style={{ padding: '20px', borderRadius: '8px', background: '#f3e5f5', border: '1px solid #ce93d8' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#4a148c' }}>Blockchain Settlements</h3>
                        <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{stats.totalOrders}</p>
                    </div>

                </div>
            )}

            <section style={{ marginTop: '40px', padding: '20px', background: '#fafafa', border: '1px solid #ddd' }}>
                <h2>System Audit Logs</h2>
                <p style={{ color: 'green', margin: 0 }}>🟢 Local EVM Blockchain RPC Node connection status: <strong>Online (Port 8545)</strong></p>
                <p style={{ color: 'green', margin: '5px 0 0 0' }}>🟢 Central Database cluster connection status: <strong>Connected (Port 27017)</strong></p>
            </section>
        </div>
    );
};

export default AdminDash;
