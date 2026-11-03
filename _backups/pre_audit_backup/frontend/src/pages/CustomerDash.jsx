import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CustomerDash = () => {
    const [customerId, setCustomerId] = useState('65f123456789abcdef012345'); // Dummy ID till login integration
    const [listings, setListings] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState({ name: 'John Doe', email: 'john@example.com' });
    const [isEditing, setIsEditing] = useState(false);

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

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>AgriTradeChain Customer Portal</h1>
            <hr />

            {/* Profile Section */}
            <section style={{ marginBottom: '30px' }}>
                <h2>3. Update Profile</h2>
                {!isEditing ? (
                    <div>
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateProfile}>
                        <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
                        <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} required />
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                )}
            </section>

            {/* Browse Section */}
            <section style={{ marginBottom: '30px' }}>
                <h2>4. Available Agricultural Listings</h2>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {listings.length === 0 ? <p>No crops currently listed by farmers.</p> : listings.map(item => (
                        <div key={item._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                            <h3>{item.cropType}</h3>
                            <p>Quantity: {item.quantity} kg</p>
                            <p>Price: <strong>{item.priceInEth} ETH</strong></p>
                            <p>Farmer: {item.farmer?.name || 'Unknown'}</p>
                            <button onClick={() => addToCart(item)}>Add to Transaction Queue</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Cart/Queue Management Section */}
            <section style={{ marginBottom: '30px', background: '#f9f9f9', padding: '15px' }}>
                <h2>5, 6, 7. Transaction Queue (Cart Management)</h2>
                {cart.length === 0 ? <p>Queue is empty.</p> : cart.map(item => (
                    <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                        <span><strong>{item.cropType}</strong> ({item.priceInEth} ETH)</span>
                        <div>
                            <label>Qty Update: </label>
                            <input type="number" min="1" value={item.quantityOrdered} onChange={e => updateCartQuantity(item._id, e.target.value)} style={{ width: '60px' }} />
                        </div>
                        <button onClick={() => handleCheckout(item)} style={{ background: 'green', color: '#fff' }}>8. Purchase via Escrow</button>
                        <button onClick={() => removeFromCart(item._id)} style={{ background: 'red', color: '#fff' }}>Remove</button>
                    </div>
                ))}
            </section>

            {/* View Orders History */}
            <section>
                <h2>9. Verified Blockchain Orders History</h2>
                {orders.length === 0 ? <p>No completed orders found.</p> : orders.map(order => (
                    <div key={order._id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                        <p>Order ID: {order._id} | Status: <strong>{order.status || 'Pending'}</strong></p>
                        <p style={{ fontSize: '12px', color: '#666' }}>
                            Tx Hash: <code style={{ background: '#eee', padding: '2px 4px' }}>{order.transactionHash}</code>
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default CustomerDash;
