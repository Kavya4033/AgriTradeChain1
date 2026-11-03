import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Container from '../components/layout/Container';
import Panel from '../components/layout/Panel';
import StatusBadge, { StepTracker } from '../components/StatusBadge';
import { getCropEmoji } from '../utils/statusMap';
import { API_BASE } from '../config';

const Landing = () => {
    const [featuredCrops, setFeaturedCrops] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/customer/listings?sort=price_asc`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFeaturedCrops(data.slice(0, 3));
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
            <Navbar />

            {/* Hero Section */}
            <section style={{
                padding: '64px 0 72px',
                borderBottom: '1px solid var(--line)',
                background: 'var(--surface)'
            }}>
                <Container style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--line)',
                        color: 'var(--ink-2)',
                        padding: '6px 16px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        marginBottom: '24px'
                    }}>
                        <span>🌱</span> Direct agricultural exchange with escrow
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                        fontWeight: '800',
                        color: 'var(--ink)',
                        lineHeight: 1.2,
                        letterSpacing: '-0.025em',
                        marginBottom: '20px',
                        maxWidth: '860px',
                        marginInline: 'auto'
                    }}>
                        Direct farm trade with payment kept safe in smart contract escrow
                    </h1>

                    <p style={{
                        fontSize: '1.1rem',
                        color: 'var(--ink-2)',
                        lineHeight: 1.6,
                        maxWidth: '680px',
                        marginInline: 'auto',
                        marginBottom: '36px'
                    }}>
                        Buyers lock Ethereum into a transparent smart contract, and farmers receive guaranteed
                        direct payment the moment harvest delivery is confirmed.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <Link to="/marketplace" className="btn-primary btn-large">
                            Browse marketplace
                        </Link>
                        <Link to="/register?role=farmer" className="btn-secondary btn-large">
                            Join as a farmer
                        </Link>
                    </div>
                </Container>
            </section>

            {/* How It Works (Step sequence) */}
            <section style={{ padding: '64px 0' }}>
                <Container>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--ink)' }}>
                            How the trade works
                        </h2>
                        <p style={{ fontSize: '1rem', color: 'var(--ink-2)', marginTop: '8px' }}>
                            Every transaction follows an icon-first 3-step escrow journey
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px'
                    }}>
                        <Panel>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: 'var(--radius-control)',
                                background: 'var(--surface-2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                marginBottom: '16px'
                            }}>
                                🌾
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--ink)', marginBottom: '8px' }}>
                                1. Farmers list harvest
                            </h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                                Farmers publish real crop quantity, farm location, and fair pricing in ETH.
                            </p>
                        </Panel>

                        <Panel>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: 'var(--radius-control)',
                                background: 'var(--safe-bg)',
                                color: 'var(--safe)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                marginBottom: '16px'
                            }}>
                                🔒
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--ink)', marginBottom: '8px' }}>
                                2. Money kept safe
                            </h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                                The buyer deposits crypto via MetaMask directly into the smart contract escrow vault.
                            </p>
                        </Panel>

                        <Panel>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: 'var(--radius-control)',
                                background: 'var(--done-bg)',
                                color: 'var(--done)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                marginBottom: '16px'
                            }}>
                                ✅
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--ink)', marginBottom: '8px' }}>
                                3. Money received
                            </h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                                Upon verified physical delivery, the smart contract releases funds straight to the farmer.
                            </p>
                        </Panel>
                    </div>
                </Container>
            </section>

            {/* Featured crops */}
            {featuredCrops.length > 0 && (
                <section style={{ padding: '48px 0 64px', background: 'var(--surface)', borderTop: '1px solid var(--line)' }}>
                    <Container>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--ink)' }}>
                                    Fresh harvests for sale
                                </h2>
                                <p style={{ fontSize: '0.95rem', color: 'var(--ink-2)', marginTop: '4px' }}>
                                    Ready for immediate purchase via escrow
                                </p>
                            </div>
                            <Link to="/marketplace" className="btn-secondary">
                                View all crops →
                            </Link>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '24px'
                        }}>
                            {featuredCrops.map(crop => (
                                <Panel key={crop._id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <StatusBadge status="Available" />
                                            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--ink)' }}>
                                                {crop.priceInEth} ETH
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '2rem' }}>{getCropEmoji(crop.cropType)}</span>
                                            <div>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ink)' }}>
                                                    {crop.cropType}
                                                </h3>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--ink-2)' }}>
                                                    {crop.quantity} kg available
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '0.9rem', color: 'var(--ink-3)', marginTop: '12px', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                                            Farmer: {crop.farmer?.name || 'Local Producer'}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '20px' }}>
                                        <Link to="/marketplace" className="btn-primary" style={{ width: '100%' }}>
                                            Purchase crop
                                        </Link>
                                    </div>
                                </Panel>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* Footer */}
            <footer style={{
                marginTop: 'auto',
                background: 'var(--surface-2)',
                borderTop: '1px solid var(--line)',
                padding: '36px 0'
            }}>
                <Container style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--ink)' }}>
                            AgriTradeChain
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--ink-3)', marginTop: '4px' }}>
                            Smart contract escrow for agricultural producers and buyers.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link to="/marketplace" style={{ color: 'var(--ink-2)', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Marketplace</Link>
                        <Link to="/login" style={{ color: 'var(--ink-2)', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Sign in</Link>
                        <Link to="/register" style={{ color: 'var(--ink-2)', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Register</Link>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default Landing;
