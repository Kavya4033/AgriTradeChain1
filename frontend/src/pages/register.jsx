
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

function Register() {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') === 'customer' ? 'Customer' : 'Farmer';

    const [role, setRole] = useState(initialRole);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must contain at least 6 characters');
            return;
        }

        setLoading(true);

        const userData = {
            name,
            email,
            password,
            walletAddress
        };

        if (role === 'Farmer') {
            userData.location = location;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/${role.toLowerCase()}/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Registration failed');
            }

            setMessage(data.message || 'Registration successful!');

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            setError(err.message || 'Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '8px 0 15px',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '5px'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f0f4f0',
            padding: '20px'
        }}>
            <div style={{
                width: '380px',
                padding: '30px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', color: '#287a35' }}>
                    AgriTradeChain
                </h2>

                <h3 style={{ textAlign: 'center' }}>Create Account</h3>

                <form onSubmit={handleRegister}>
                    <label>Register As</label>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="Farmer">Farmer</option>
                        <option value="Customer">Customer</option>
                    </select>

                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <label>Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <label>MetaMask Wallet Address</label>
                    <input
                        type="text"
                        placeholder="Enter wallet address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    {role === 'Farmer' && (
                        <>
                            <label>Farm Location</label>
                            <input
                                type="text"
                                placeholder="Enter farm location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </>
                    )}

                    {error && (
                        <p style={{ color: 'red' }}>{error}</p>
                    )}

                    {message && (
                        <p style={{ color: 'green' }}>{message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#287a35',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
