import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Container from '../components/layout/Container';
import EmptyState from '../components/common/EmptyState';
import CropCard from '../components/common/CropCard';
import { API_BASE } from '../config';

const TRADE_STEPS = [
    {
        icon: '🌾',
        title: '1. Farmers list harvest',
        description: 'Farmers publish real crop quantity, farm location, and fair pricing in ETH.'
    },
    {
        icon: '🔒',
        title: '2. Money kept safe',
        description: 'The buyer deposits crypto via MetaMask directly into the smart contract escrow vault.'
    },
    {
        icon: '📦',
        title: '3. Physical delivery',
        description: 'The harvest is delivered directly between the farmer and the buyer.'
    },
    {
        icon: '✅',
        title: '4. Money received',
        description: 'Upon verified physical delivery, the smart contract releases funds straight to the farmer.'
    }
];

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
        <div className="landing-page">
            <Navbar />
            <section className="landing-hero">
                <Container>
                    <div className="landing-hero-content">
                        <div className="landing-kicker"><span aria-hidden="true">🌱</span> Direct agricultural exchange with escrow</div>
                        <h1 className="landing-title">Direct farm trade with payment kept safe <span>in smart contract escrow</span></h1>
                        <p className="landing-copy">
                            Buyers lock Ethereum into a transparent smart contract, and farmers receive guaranteed direct payment the moment harvest delivery is confirmed.
                        </p>
                        <div className="landing-actions">
                            <Link to="/marketplace" className="btn-primary btn-large">🛒 Browse marketplace</Link>
                            <Link to="/register?role=farmer" className="btn-secondary btn-large">🧑‍🌾 Join as a farmer</Link>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="landing-section">
                <Container>
                    <header className="landing-section-heading">
                        <span>Escrow process</span>
                        <h2>How the trade works</h2>
                        <p>Four clear steps from farm listing to settlement.</p>
                    </header>
                    <div className="landing-how-grid">
                        {TRADE_STEPS.map((step, index) => (
                            <article className="landing-step-card" key={step.title}>
                                <span className={`landing-step-icon step-tone-${index + 1}`} aria-hidden="true">{step.icon}</span>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </article>
                        ))}
                    </div>
                </Container>
            </section>

            <section className="landing-harvests">
                <Container>
                    <header className="landing-harvests-heading">
                        <div>
                            <h2>Fresh harvests for sale</h2>
                            <p>Ready for immediate purchase via escrow.</p>
                        </div>
                        <Link to="/marketplace" className="btn-secondary">View all crops →</Link>
                    </header>
                    {featuredCrops.length > 0 ? (
                        <div className="landing-crop-grid">
                            {featuredCrops.map(crop => (
                                <CropCard
                                    key={crop._id}
                                    crop={crop}
                                    action={<Link to="/marketplace" className="btn-primary">Purchase crop</Link>}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="🌾"
                            title="No featured harvests"
                            description="Available crop listings will appear here."
                        />
                    )}
                </Container>
            </section>

            <footer className="landing-footer">
                <Container className="landing-footer-content">
                    <div>
                        <strong>AgriTradeChain</strong>
                        <p>Smart contract escrow for agricultural producers and buyers.</p>
                    </div>
                    <nav aria-label="Footer navigation">
                        <Link to="/marketplace">Marketplace</Link>
                        <Link to="/login">Sign in</Link>
                        <Link to="/register">Register</Link>
                    </nav>
                </Container>
            </footer>
        </div>
    );
};

export default Landing;
