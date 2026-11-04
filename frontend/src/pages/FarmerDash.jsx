import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from '../components/layout/Navbar';
import Container from '../components/layout/Container';
import DashboardLayout from '../components/layout/DashboardLayout';
import Panel from '../components/layout/Panel';
import MetricCard from '../components/MetricCard';
import StatusLegendPanel from '../components/StatusLegendPanel';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/common/DataTable';
import EmptyState from '../components/common/EmptyState';
import Tabs from '../components/common/Tabs';

const FarmerDash = () => {
    // Dummy Farmer ID for testing (matches a MongoDB ObjectId format)
    const [farmerId, setFarmerId] = useState('65f888888789abcdef088888');
    const [myItems, setMyItems] = useState([]);
    const [cropType, setCropType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [priceInEth, setPriceInEth] = useState('');
    const [activeTab, setActiveTab] = useState('inventory');

    // Smart Contract config matching our local hardhat network deployment
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractABI = [
        "function createListing(string memory _cropType, uint256 _quantity, uint256 _priceInWei) public"
    ];

    useEffect(() => {
        fetchMyItems();
    }, []);

    const fetchMyItems = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/farmer/items/${farmerId}`);
            const data = await res.json();
            setMyItems(data);
        } catch (err) { console.error("Error loading inventory:", err); }
    };

    // ADD CROP ITEM (Pushes listing to local Blockchain via MetaMask AND saves to MongoDB)
    const handleAddCrop = async (e) => {
        e.preventDefault();
        if (!window.ethereum) return alert("Please install MetaMask to issue smart contract commands!");

        try {
            // 1. Trigger MetaMask wallet interface interaction
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Convert Ether entry to standard Wei metric units
            const priceInWei = ethers.utils.parseEther(priceInEth.toString());

            alert(`MetaMask will now request you to broadcast this crop listing to the blockchain.`);

            // 2. Publish item on the local Blockchain Smart Contract
            const tx = await contract.createListing(cropType, Number(quantity), priceInWei);
            await tx.wait(); // Pause for mining confirmation execution

            // 3. Save matching database listing item configuration data to MongoDB via Express
            const res = await fetch('http://localhost:5000/api/farmer/items/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    farmerId,
                    cropType,
                    quantity: Number(quantity),
                    priceInEth: Number(priceInEth)
                })
            });

            if (res.ok) {
                alert("Crop successfully listed on Blockchain and Database!");
                setCropType('');
                setQuantity('');
                setPriceInEth('');
                fetchMyItems(); // Refresh inventory listing matrix data view
            }
        } catch (err) {
            console.error("Failed to add crop:", err);
            alert("Blockchain transaction error or user rejected listing.");
        }
    };

    // REMOVE CROP ITEM
    const handleRemoveCrop = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/farmer/items/remove/${itemId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert("Listing item removed.");
                fetchMyItems();
            }
        } catch (err) { console.error(err); }
    };

    const availableListings = myItems.filter(item => item.status === 'Available');
    const soldListings = myItems.filter(item => item.status === 'Sold');
    const availableQuantity = availableListings.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
    );

    const tabs = [
        { id: 'inventory', icon: '🌾', label: 'My Crop Inventory', count: myItems.length },
        { id: 'orders', icon: '📦', label: 'Customer Orders & Escrow', count: '—' },
        { id: 'analytics', icon: '📈', label: 'Revenue Analytics' },
        { id: 'profile', icon: '👤', label: 'Farmer Profile' }
    ];

    return (
        <>
            <Navbar />
            <main className="farmer-dashboard-page">
                <Container>
                    <div className="farmer-dashboard">
                        <header className="farmer-dashboard-heading">
                            <div>
                                <h1>Farmer Dashboard &amp; Escrow</h1>
                                <p>Track active harvest inventory, customer escrow orders, and confirmed settlements.</p>
                            </div>
                            <details className="harvest-listing-details" id="new-harvest">
                                <summary className="btn-primary farmer-primary-action">🌽 List New Harvest</summary>
                                <div className="harvest-form-panel">
                                    <h2>List a New Crop on Blockchain</h2>
                                    <form onSubmit={handleAddCrop} className="harvest-form">
                                        <label>
                                            Crop type
                                            <input className="input-field" type="text" placeholder="e.g. Wheat, Rice, Corn" value={cropType} onChange={e => setCropType(e.target.value)} required />
                                        </label>
                                        <label>
                                            Quantity (kg)
                                            <input className="input-field" type="number" placeholder="Quantity in kg" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                                        </label>
                                        <label>
                                            Price (ETH)
                                            <input className="input-field" type="number" step="0.01" placeholder="Price in Ether" value={priceInEth} onChange={e => setPriceInEth(e.target.value)} required />
                                        </label>
                                        <button type="submit" className="btn-primary farmer-primary-action">
                                            Publish Listing
                                        </button>
                                    </form>
                                </div>
                            </details>
                        </header>

                        <div className="stat-card-grid farmer-stat-grid">
                            <MetricCard
                                icon="🌾"
                                value={availableListings.length}
                                title="Active Inventory"
                                subtext={`${availableQuantity} kg in stock`}
                                tone="safe"
                            />
                            <MetricCard
                                icon="📦"
                                value={soldListings.length}
                                title="Sold Crops"
                                subtext="From your crop listings"
                            />
                            <MetricCard
                                icon="🔒"
                                value="—"
                                title="Pending Orders"
                                subtext="Order data is not loaded on this page"
                                tone="wait"
                            />
                            <MetricCard
                                icon="✅"
                                value="—"
                                title="Delivered Orders"
                                subtext="Order data is not loaded on this page"
                            />
                            <MetricCard
                                icon="💰"
                                value="—"
                                unit="ETH"
                                title="Settled Revenue"
                                subtext="Settlement data is not loaded on this page"
                            />
                        </div>

                        <Tabs
                            items={tabs}
                            value={activeTab}
                            onChange={setActiveTab}
                            ariaLabel="Farmer dashboard sections"
                        />

                        <DashboardLayout
                            main={(
                                <>
                                    {activeTab === 'inventory' && (
                                        <Panel
                                            title={`Published Harvest Listings (${myItems.length})`}
                                            action={(
                                                <button type="button" className="btn-secondary" onClick={fetchMyItems}>
                                                    Refresh Inventory
                                                </button>
                                            )}
                                        >
                                            {myItems.length === 0 ? (
                                                <EmptyState
                                                    icon="🌾"
                                                    title="No crop listings yet"
                                                    description="Listings returned for this farmer will appear here."
                                                />
                                            ) : (
                                                <DataTable
                                                    rows={myItems}
                                                    minWidth="48rem"
                                                    caption="Your current crop inventory"
                                                    columns={[
                                                        { key: 'cropType', label: 'Crop Variety' },
                                                        { key: 'createdAt', label: 'Listed', render: value => formatDate(value) },
                                                        { key: 'quantity', label: 'Quantity', render: value => `${value} kg` },
                                                        { key: 'priceInEth', label: 'Price in ETH', render: value => `${value} ETH` },
                                                        { key: 'status', label: 'Marketplace Status', render: value => <StatusBadge status={value} /> },
                                                        {
                                                            key: 'actions',
                                                            label: 'Actions',
                                                            render: (_, item) => (
                                                                <button type="button" className="btn-secondary farmer-delete-action" onClick={() => handleRemoveCrop(item._id)}>
                                                                    Delete
                                                                </button>
                                                            )
                                                        }
                                                    ]}
                                                />
                                            )}
                                        </Panel>
                                    )}

                                    {activeTab === 'orders' && (
                                        <Panel title="Incoming Customer Orders & Settlements">
                                            <EmptyState
                                                icon="📦"
                                                title="Order information is unavailable"
                                                description="This dashboard does not load farmer order records, so order and escrow details cannot be shown here."
                                            />
                                        </Panel>
                                    )}

                                    {activeTab === 'analytics' && (
                                        <Panel title="Confirmed Settlement Analytics">
                                            <div className="farmer-revenue-grid">
                                                <section className="farmer-revenue-chart">
                                                    <h2>Monthly Settled Revenue (ETH)</h2>
                                                    <svg viewBox="0 0 360 180" role="img" aria-label="Empty monthly revenue chart">
                                                        <path d="M36 16V148H344" fill="none" stroke="var(--line)" strokeWidth="2" />
                                                        <path d="M36 48H344M36 82H344M36 116H344" fill="none" stroke="var(--line)" strokeWidth="1" />
                                                    </svg>
                                                    <p>Settlement data is not loaded by this dashboard. No revenue values are plotted.</p>
                                                </section>
                                                <section className="farmer-revenue-chart">
                                                    <h2>Crop-Wise Sales Distribution</h2>
                                                    <svg viewBox="0 0 180 180" role="img" aria-label="Empty crop sales distribution chart">
                                                        <circle cx="90" cy="90" r="58" fill="none" stroke="var(--line)" strokeWidth="18" />
                                                    </svg>
                                                    <p>Sales distribution cannot be calculated without order records.</p>
                                                </section>
                                            </div>
                                        </Panel>
                                    )}

                                    {activeTab === 'profile' && (
                                        <Panel title="Farmer Profile">
                                            <EmptyState
                                                icon="🧑‍🌾"
                                                title="Profile details are unavailable"
                                                description="This dashboard does not load farmer profile details."
                                            />
                                        </Panel>
                                    )}
                                </>
                            )}
                            sidebar={(
                                <>
                                    <Panel title="Next payout">
                                        <p className="farmer-sidebar-note">Payout details are not available from the current inventory data.</p>
                                    </Panel>
                                    <StatusLegendPanel />
                                </>
                            )}
                        />
                    </div>
                </Container>
            </main>
        </>
    );
};

function formatDate(value) {
    if (!value) return 'Date unavailable';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString();
}

export default FarmerDash;
