import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from '../components/layout/Navbar';
import Container from '../components/layout/Container';
import DashboardLayout from '../components/layout/DashboardLayout';
import Panel from '../components/layout/Panel';
import StatusBadge, { StepTracker } from '../components/StatusBadge';
import { getStatusInfo } from '../utils/statusMap';
import DataTable from '../components/common/DataTable';
import Tabs from '../components/common/Tabs';
import EmptyState from '../components/common/EmptyState';
import CropCard from '../components/common/CropCard';
import AddressChip from '../components/common/AddressChip';
import TxHashBadge from '../components/common/TxHashBadge';
import { useAuth } from '../context/AuthContext';

const CROP_CATEGORIES = ['All', 'Wheat', 'Rice', 'Corn', 'Barley', 'Soybean', 'Cotton', 'Vegetables', 'Fruits'];

const CustomerDash = () => {
    const [customerId, setCustomerId] = useState('65f123456789abcdef012345'); // Dummy ID till login integration
    const [listings, setListings] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState({ name: 'John Doe', email: 'john@example.com' });
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('orders');
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [appliedCategory, setAppliedCategory] = useState('All');
    const { user } = useAuth();

    // Smart Contract Config (Matches local Hardhat environment configurations)
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractABI = [
        "function purchaseCrop(uint256 _id) public payable"
    ];

    // 4. VIEW LISTING ITEMS & 9. VIEW ORDERS
    useEffect(() => {
        fetchListings();
        fetchOrders();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/customer/listings');
            const data = await res.json();
            // If data is an array, save it; otherwise default to an empty list
            setListings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching crops:", err);
            setListings([]); // Fallback array to prevent layout crash
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/customer/orders/${customerId}`);
            const data = await res.json();
            setOrders(data);
        } catch (err) { console.error("Error fetching orders:", err); }
    };

    // 3. UPDATE PROFILE
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/customer/profile/${customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            if (res.ok) {
                alert("Profile updated successfully!");
                setIsEditing(false);
            }
        } catch (err) { console.error(err); }
    };

    // 5. ADD ITEMS TO QUEUE / CART
    const addToCart = (item) => {
        if (cart.find(c => c._id === item._id)) return;
        setCart([...cart, { ...item, quantityOrdered: 1 }]);
    };

    // 6. REMOVE ITEMS FROM QUEUE / CART
    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
    };

    // 7. UPDATE ITEMS IN QUEUE / CART
    const updateCartQuantity = (id, newQty) => {
        setCart(cart.map(item => item._id === id ? { ...item, quantityOrdered: Number(newQty) } : item));
    };

    // 8. MAKE ORDER (Executes Blockchain Escrow Transaction first, then stores in MongoDB)
    const handleCheckout = async (item) => {
        if (!window.ethereum) return alert("Please install MetaMask to execute transaction!");

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Hardcoded listing item ID index 1 for simulation test
            const priceInWei = ethers.utils.parseEther(item.priceInEth.toString());

            alert(`MetaMask will now prompt you to lock ${item.priceInEth} ETH in Escrow.`);

            // Trigger Smart Contract Tx
            const tx = await contract.purchaseCrop(1, { value: priceInWei });
            await tx.wait(); // Wait for mining confirmation

            // Save order mapping to MongoDB backend server
            const orderRes = await fetch('http://localhost:5000/api/customer/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId,
                    itemId: item._id,
                    farmerId: item.farmer._id,
                    transactionHash: tx.hash
                })
            });

            if (orderRes.ok) {
                alert("Blockchain trade compiled successfully!");
                removeFromCart(item._id);
                fetchListings();
                fetchOrders();
            }
        } catch (err) {
            console.error("Blockchain transaction failed:", err);
            alert("Transaction rejected or encountered an error.");
        }
    };

    const handleApplyFilters = (event) => {
        event.preventDefault();
        setAppliedSearch(searchText.trim().toLowerCase());
        setAppliedCategory(selectedCategory);
    };

    const filteredListings = listings.filter((item) => {
        const matchesSearch = !appliedSearch || item.cropType?.toLowerCase().includes(appliedSearch);
        const matchesCategory = appliedCategory === 'All' || item.cropType?.toLowerCase().includes(appliedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    const tabs = [
        { id: 'orders', icon: '📦', label: 'My Orders & Escrow', count: orders.length },
        { id: 'browse', icon: '🌽', label: 'Browse Crops', count: listings.length },
        { id: 'queue', icon: '🛒', label: 'Queue', count: cart.length },
        { id: 'profile', icon: '👤', label: 'Profile' }
    ];

    const customerName = user?.name || user?.email?.split('@')[0];

    return (
        <>
            <Navbar />
            <main className="customer-dashboard-page">
                <Container>
                    <div className="customer-dashboard">
                        <header className="customer-dashboard-heading">
                            <div>
                                <span className="customer-portal-label">🛒 Buyer Portal</span>
                                <h1>{customerName ? `Welcome back, ${customerName}` : 'Customer Portal'}</h1>
                                <p>Manage your escrow orders, track delivery, and browse farm listings.</p>
                            </div>
                        </header>

                        <Tabs
                            items={tabs}
                            value={activeTab}
                            onChange={setActiveTab}
                            ariaLabel="Customer portal sections"
                        />

                        <DashboardLayout
                            main={(
                                <>
                                    {activeTab === 'orders' && (
                                        <Panel
                                            title={`Escrow Order Ledger (${orders.length})`}
                                            action={(
                                                <button type="button" className="btn-secondary" onClick={fetchOrders}>
                                                    Refresh Orders
                                                </button>
                                            )}
                                        >
                                            {orders.length === 0 ? (
                                                <EmptyState
                                                    icon="📦"
                                                    title="No orders returned"
                                                    description="Orders returned for this customer will appear in the escrow ledger."
                                                    actionLabel="Browse harvest listings"
                                                    onAction={() => setActiveTab('browse')}
                                                />
                                            ) : (
                                                <DataTable
                                                    rows={orders}
                                                    minWidth="64rem"
                                                    caption="Customer orders and escrow status"
                                                    columns={[
                                                        {
                                                            key: '_id',
                                                            label: 'Order & Date',
                                                            render: (value, order) => (
                                                                <div className="customer-order-id">
                                                                    <strong>#{String(value).slice(-6)}</strong>
                                                                    <span>{formatDate(order.createdAt)}</span>
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            key: 'item',
                                                            label: 'Crop Item',
                                                            render: item => (
                                                                <div className="customer-order-crop">
                                                                    <strong>{item?.cropType || 'Crop details unavailable'}</strong>
                                                                    <span>{item?.quantity != null ? `${item.quantity} kg` : 'Quantity unavailable'} · {item?.priceInEth != null ? `${item.priceInEth} ETH` : 'Price unavailable'}</span>
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            key: 'farmer',
                                                            label: 'Farmer Details',
                                                            render: farmer => (
                                                                <div className="customer-order-farmer">
                                                                    <strong>{farmer?.name || 'Farmer details unavailable'}</strong>
                                                                    {farmer?.walletAddress && <AddressChip address={farmer.walletAddress} />}
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            key: 'transactionHash',
                                                            label: 'Escrow Tx Hash',
                                                            render: hash => <TxHashBadge hash={hash} label="Purchase" />
                                                        },
                                                        {
                                                            key: 'status',
                                                            label: 'Escrow Status',
                                                            render: status => (
                                                                <div className="customer-order-status">
                                                                    <StatusBadge status={status} />
                                                                    <StepTracker currentStep={getStatusInfo(status).step} />
                                                                </div>
                                                            )
                                                        }
                                                    ]}
                                                />
                                            )}
                                        </Panel>
                                    )}

                                    {activeTab === 'browse' && (
                                        <section className="customer-browse-section">
                                            <form className="customer-filter-bar" onSubmit={handleApplyFilters}>
                                                <label className="customer-search-field">
                                                    Search crops
                                                    <input
                                                        className="input-field"
                                                        type="search"
                                                        placeholder="Search by crop variety..."
                                                        value={searchText}
                                                        onChange={event => setSearchText(event.target.value)}
                                                    />
                                                </label>
                                                <label className="customer-category-field">
                                                    Category
                                                    <select className="select-field" value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)}>
                                                        {CROP_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                                                    </select>
                                                </label>
                                                <button type="submit" className="btn-primary">Filter</button>
                                            </form>

                                            {filteredListings.length === 0 ? (
                                                <EmptyState
                                                    icon="🌾"
                                                    title="No crops found"
                                                    description="No listings match the current search and category."
                                                    actionLabel="Clear filters"
                                                    onAction={() => {
                                                        setSearchText('');
                                                        setSelectedCategory('All');
                                                        setAppliedSearch('');
                                                        setAppliedCategory('All');
                                                    }}
                                                />
                                            ) : (
                                                <div className="crop-card-grid">
                                                    {filteredListings.map(item => (
                                                        <CropCard
                                                            key={item._id}
                                                            crop={item}
                                                            action={(
                                                                <div className="customer-crop-actions">
                                                                    <button type="button" className="btn-secondary" onClick={() => addToCart(item)}>+ Queue</button>
                                                                    <button type="button" className="btn-primary" onClick={() => handleCheckout(item)}>🔒 Buy Escrow</button>
                                                                </div>
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </section>
                                    )}

                                    {activeTab === 'queue' && (
                                        <Panel title={`Transaction Queue (${cart.length})`}>
                                            {cart.length === 0 ? (
                                                <EmptyState
                                                    icon="🛒"
                                                    title="Queue is empty"
                                                    description="You have not added any crops to your transaction queue yet."
                                                    actionLabel="Browse harvest listings"
                                                    onAction={() => setActiveTab('browse')}
                                                />
                                            ) : (
                                                <div className="customer-queue-list">
                                                    {cart.map(item => (
                                                        <article className="customer-queue-item" key={item._id}>
                                                            <div className="customer-queue-details">
                                                                <strong>{item.cropType}</strong>
                                                                <span>{item.priceInEth} ETH</span>
                                                            </div>
                                                            <label className="customer-queue-quantity">
                                                                Quantity
                                                                <input className="input-field" type="number" min="1" value={item.quantityOrdered} onChange={event => updateCartQuantity(item._id, event.target.value)} />
                                                            </label>
                                                            <div className="customer-queue-actions">
                                                                <button type="button" className="btn-primary" onClick={() => handleCheckout(item)}>🔒 Buy Escrow</button>
                                                                <button type="button" className="btn-secondary" onClick={() => removeFromCart(item._id)}>Remove</button>
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            )}
                                        </Panel>
                                    )}

                                    {activeTab === 'profile' && (
                                        <Panel title="Customer Profile & Wallet">
                                            <EmptyState
                                                icon="👤"
                                                title="Profile data is unavailable"
                                                description="The current customer login response does not provide profile details, and this page has no supported profile endpoint."
                                            />
                                        </Panel>
                                    )}
                                </>
                            )}
                            sidebar={(
                                <>
                                    <Panel title="Wallet summary">
                                        {user?.walletAddress ? (
                                            <AddressChip address={user.walletAddress} />
                                        ) : (
                                            <p className="customer-sidebar-note">A wallet address is not included in the current customer login response.</p>
                                        )}
                                    </Panel>
                                    <Panel title={`Transaction Queue (${cart.length})`}>
                                        <p className="customer-sidebar-note">
                                            {cart.length ? `${cart.length} crop${cart.length === 1 ? '' : 's'} queued for purchase.` : 'Your queue is empty.'}
                                        </p>
                                        <button type="button" className="btn-secondary" onClick={() => setActiveTab(cart.length ? 'queue' : 'browse')}>
                                            {cart.length ? 'View Queue' : 'Browse Crops'}
                                        </button>
                                    </Panel>
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

export default CustomerDash;
