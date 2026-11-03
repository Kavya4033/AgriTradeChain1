import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Navbar from '../components/layout/Navbar';
import Container from '../components/layout/Container';
import Panel from '../components/layout/Panel';
import Modal from '../components/common/Modal';
import TxHashBadge from '../components/common/TxHashBadge';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { connectWallet, isMetaMaskInstalled, getAgriContract } from '../utils/web3';
import { getCropEmoji } from '../utils/statusMap';
import { API_BASE } from '../config';

const CROP_CATEGORIES = ['All', 'Wheat', 'Rice', 'Corn', 'Barley', 'Soybean', 'Cotton', 'Vegetables', 'Fruits'];

const Marketplace = () => {
    const { user, apiFetch } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('date');

    // Checkout modal state
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState('idle'); // idle | wallet | sending | mining | completed | error
    const [lastTxHash, setLastTxHash] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchListings = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory !== 'All') params.append('cropType', selectedCategory);
            if (sortBy) params.append('sort', sortBy);

            const res = await fetch(`${API_BASE}/customer/listings?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setListings(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Failed to load listings:', err);
            showToast('Failed to load crop listings', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [selectedCategory, sortBy]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchListings();
    };

    const handleOpenCheckout = (crop) => {
        if (!user) {
            showToast('Please sign in as a customer to purchase', 'info');
            navigate('/login?redirect=marketplace');
            return;
        }

        if (user.role === 'Farmer') {
            showToast('Farmer accounts cannot purchase crops. Please use a customer account.', 'error');
            return;
        }

        setSelectedCrop(crop);
        setCheckoutStep('idle');
        setErrorMessage('');
        setLastTxHash('');
        setIsCheckingOut(true);
    };

    const handleConfirmPurchase = async () => {
        if (!isMetaMaskInstalled()) {
            showToast('Please install MetaMask to execute on-chain escrow transaction', 'error');
            return;
        }

        try {
            setCheckoutStep('wallet');
            setErrorMessage('');

            // 1. Connect MetaMask and verify network
            const { signer } = await connectWallet();

            setCheckoutStep('sending');
            const contract = getAgriContract(signer);

            // Calculate Wei value
            const priceInWei = ethers.utils.parseEther(selectedCrop.priceInEth.toString());
            const onChainId = selectedCrop.blockchainListingId || 1;

            showToast(`Prompting MetaMask for ${selectedCrop.priceInEth} ETH escrow...`, 'info');

            // 2. Broadcast on-chain transaction
            const tx = await contract.purchaseCrop(onChainId, { value: priceInWei });
            setLastTxHash(tx.hash);
            setCheckoutStep('mining');

            // 3. Wait for mining confirmation
            const receipt = await tx.wait();

            if (receipt.status !== 1) {
                throw new Error('Transaction execution reverted on blockchain');
            }

            // 4. Save order to MongoDB backend with Pending status
            const orderRes = await apiFetch('/customer/order', {
                method: 'POST',
                body: JSON.stringify({
                    customerId: user.id,
                    itemId: selectedCrop._id,
                    farmerId: selectedCrop.farmer?._id || selectedCrop.farmer,
                    transactionHash: tx.hash
                })
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.message || 'Database order logging failed');
            }

            setCheckoutStep('completed');
            showToast('Escrow locked successfully! Money is kept safe pending delivery.', 'success');
            fetchListings();

        } catch (err) {
            console.error('Checkout error:', err);
            setCheckoutStep('error');
            setErrorMessage(err.message || 'Purchase transaction failed');
            showToast(err.message || 'Transaction failed', 'error');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
            <Navbar />

            <main style={{ padding: '36px 0 60px', flex: 1 }}>
                <Container>
                    {/* Header */}
                    <div style={{ marginBottom: '28px' }}>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--ink)' }}>
                            Agricultural marketplace
                        </h1>
                        <p style={{ color: 'var(--ink-2)', fontSize: '1rem', marginTop: '6px' }}>
                            Browse verified harvests. Payments are held safely in escrow until you confirm delivery.
                        </p>
                    </div>

                    {/* Filter and Search Panel */}
                    <Panel style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                            {/* Search Input */}
                            <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 320px', display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Search crop variety (Wheat, Rice, Corn)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="btn-primary">
                                    Search
                                </button>
                            </form>

                            {/* Sort Dropdown */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
                                    Sort by:
                                </span>
                                <select
                                    className="select-field"
                                    style={{ width: 'auto' }}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="date">Newest harvest</option>
                                    <option value="price_asc">Price: low to high</option>
                                    <option value="price_desc">Price: high to low</option>
                                    <option value="quantity_desc">Highest quantity</option>
                                </select>
                            </div>
                        </div>

                        {/* Category Segmented Controls */}
                        <div className="segmented-tabs" style={{ marginTop: '12px' }}>
                            {CROP_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`segmented-tab ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </Panel>

                    {/* Crop Grid */}
                    {loading ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '24px'
                        }}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : listings.length === 0 ? (
                        <EmptyState
                            icon="🌾"
                            title="No crops found"
                            description="Try adjusting your search query or selecting another category."
                            actionLabel="Clear filters"
                            onAction={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                        />
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '24px'
                        }}>
                            {listings.map(crop => (
                                <Panel key={crop._id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                            <StatusBadge status="Available" />
                                            <div style={{ textAlign: 'right' }}>
                                                <span className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--ink)' }}>
                                                    {crop.priceInEth} ETH
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                                            <div style={{
                                                width: '54px',
                                                height: '54px',
                                                borderRadius: 'var(--radius-control)',
                                                background: 'var(--surface-2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.8rem',
                                                flexShrink: 0
                                            }}>
                                                {getCropEmoji(crop.cropType)}
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--ink)' }}>
                                                    {crop.cropType}
                                                </h3>
                                                <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem' }}>
                                                    {crop.quantity} kg available
                                                </p>
                                            </div>
                                        </div>

                                        {/* Farmer details */}
                                        <div style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--ink-3)',
                                            borderTop: '1px solid var(--line)',
                                            paddingTop: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Farmer:</span>
                                                <strong style={{ color: 'var(--ink)' }}>{crop.farmer?.name || 'Local Producer'}</strong>
                                            </div>
                                            {crop.farmer?.location && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>Location:</span>
                                                    <span>{crop.farmer.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '20px' }}>
                                        <button
                                            type="button"
                                            className="btn-primary"
                                            onClick={() => handleOpenCheckout(crop)}
                                            style={{ width: '100%' }}
                                        >
                                            🔒 Purchase via escrow
                                        </button>
                                    </div>
                                </Panel>
                            ))}
                        </div>
                    )}
                </Container>
            </main>

            {/* Smart Contract Escrow Checkout Modal */}
            <Modal
                isOpen={isCheckingOut}
                onClose={() => {
                    if (checkoutStep !== 'sending' && checkoutStep !== 'mining') {
                        setIsCheckingOut(false);
                    }
                }}
                title={checkoutStep === 'completed' ? 'Purchase successful' : 'Smart contract escrow checkout'}
                subtitle={checkoutStep === 'completed' ? 'Money is kept safe in contract' : 'Buyer protection guarantee'}
                maxWidth="500px"
            >
                {selectedCrop && (
                    <div>
                        {checkoutStep === 'idle' && (
                            <div>
                                <div style={{
                                    background: 'var(--surface-2)',
                                    border: '1px solid var(--line)',
                                    padding: '18px',
                                    borderRadius: 'var(--radius-control)',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--ink-2)', fontWeight: '600' }}>Crop variety:</span>
                                        <strong style={{ color: 'var(--ink)' }}>{selectedCrop.cropType}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--ink-2)', fontWeight: '600' }}>Quantity:</span>
                                        <strong style={{ color: 'var(--ink)' }}>{selectedCrop.quantity} kg</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                                        <span style={{ color: 'var(--ink)', fontWeight: '800' }}>Amount to lock:</span>
                                        <strong className="tabular-nums" style={{ color: 'var(--ink)', fontSize: '1.25rem' }}>
                                            {selectedCrop.priceInEth} ETH
                                        </strong>
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.95rem', color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: '24px' }}>
                                    <strong>How this trade works:</strong>
                                    <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                        <li>Your payment is deposited directly into the smart contract escrow.</li>
                                        <li>The status becomes 🔒 <strong>Safe</strong>.</li>
                                        <li>Produce is dispatched directly to your delivery address.</li>
                                        <li>Funds are paid to the farmer only after delivery confirmation.</li>
                                    </ul>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setIsCheckingOut(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={handleConfirmPurchase}
                                    >
                                        Connect MetaMask & Lock funds
                                    </button>
                                </div>
                            </div>
                        )}

                        {(checkoutStep === 'wallet' || checkoutStep === 'sending' || checkoutStep === 'mining') && (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <div className="spinner" style={{
                                    width: '48px',
                                    height: '48px',
                                    border: '4px solid var(--line)',
                                    borderTop: '4px solid var(--brand)',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                    margin: '0 auto 20px'
                                }} />
                                <h4 style={{ fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '8px' }}>
                                    {checkoutStep === 'wallet' && 'Connecting to MetaMask...'}
                                    {checkoutStep === 'sending' && 'Approve the escrow prompt in MetaMask...'}
                                    {checkoutStep === 'mining' && 'Mining transaction on blockchain...'}
                                </h4>
                                <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem' }}>
                                    {checkoutStep === 'mining'
                                        ? 'Smart contract is locking your funds securely. Please wait.'
                                        : 'Please confirm the purchase in your MetaMask wallet extension.'}
                                </p>
                                {lastTxHash && (
                                    <div style={{ marginTop: '18px' }}>
                                        <TxHashBadge hash={lastTxHash} label="Tx" />
                                    </div>
                                )}
                            </div>
                        )}

                        {checkoutStep === 'completed' && (
                            <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🔒</div>
                                <h4 style={{ fontSize: '1.35rem', color: 'var(--ink)', marginBottom: '8px' }}>
                                    Payment safely locked in escrow
                                </h4>
                                <p style={{ color: 'var(--ink-2)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
                                    Your order for <strong>{selectedCrop.quantity} kg of {selectedCrop.cropType}</strong> is confirmed.
                                    The farmer will prepare delivery.
                                </p>

                                {lastTxHash && (
                                    <div style={{
                                        background: 'var(--surface-2)',
                                        padding: '14px',
                                        borderRadius: 'var(--radius-control)',
                                        border: '1px solid var(--line)',
                                        marginBottom: '24px'
                                    }}>
                                        <TxHashBadge hash={lastTxHash} label="Blockchain proof" />
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setIsCheckingOut(false)}
                                    >
                                        Continue browsing
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={() => {
                                            setIsCheckingOut(false);
                                            navigate('/customer/dashboard');
                                        }}
                                    >
                                        View my orders →
                                    </button>
                                </div>
                            </div>
                        )}

                        {checkoutStep === 'error' && (
                            <div>
                                <div style={{
                                    background: 'var(--alert-bg)',
                                    border: '1px solid var(--alert)',
                                    color: 'var(--alert)',
                                    padding: '16px',
                                    borderRadius: 'var(--radius-control)',
                                    marginBottom: '20px',
                                    fontSize: '0.95rem'
                                }}>
                                    <strong>Transaction error:</strong>
                                    <p style={{ marginTop: '6px' }}>{errorMessage}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setIsCheckingOut(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={handleConfirmPurchase}
                                    >
                                        Try again
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Marketplace;
