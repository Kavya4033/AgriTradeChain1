import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const FarmerDash = () => {
    // Dummy Farmer ID for testing (matches a MongoDB ObjectId format)
    const [farmerId, setFarmerId] = useState('65f888888789abcdef088888');
    const [myItems, setMyItems] = useState([]);
    const [cropType, setCropType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [priceInEth, setPriceInEth] = useState('');

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

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>AgriTradeChain Farmer Dashboard</h1>
            <hr />

            {/* Crop Listing Creation Section */}
            <section style={{ marginBottom: '30px', background: '#f0f7f4', padding: '15px', borderRadius: '5px' }}>
                <h2>List a New Crop on Blockchain</h2>
                <form onSubmit={handleAddCrop} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
                    <div>
                        <label>Crop Type: </label>
                        <input type="text" placeholder="e.g. Wheat, Rice, Corn" value={cropType} onChange={e => setCropType(e.target.value)} required />
                    </div>
                    <div>
                        <label>Quantity (kg): </label>
                        <input type="number" placeholder="Quantity in kg" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    </div>
                    <div>
                        <label>Price (ETH): </label>
                        <input type="number" step="0.01" placeholder="Price in Ether" value={priceInEth} onChange={e => setPriceInEth(e.target.value)} required />
                    </div>
                    <button type="submit" style={{ padding: '10px', background: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        Publish Listing
                    </button>
                </form>
            </section>

            {/* Inventory Tracker List Section */}
            <section>
                <h2>Your Current Listings Inventory</h2>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {myItems.length === 0 ? <p>You have no active crop listings right now.</p> : myItems.map(item => (
                        <div key={item._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#fff' }}>
                            <h3>{item.cropType}</h3>
                            <p>Quantity available: {item.quantity} kg</p>
                            <p>Assigned Value: <strong>{item.priceInEth} ETH</strong></p>
                            <p>Status: <span style={{ fontWeight: 'bold', color: item.status === 'Available' ? 'green' : 'orange' }}>{item.status}</span></p>
                            <button onClick={() => handleRemoveCrop(item._id)} style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                                Delete Item
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FarmerDash;
