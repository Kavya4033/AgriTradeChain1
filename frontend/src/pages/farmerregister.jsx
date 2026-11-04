
import React, { useState } from 'react';
import '../styles/Auth.css';

const API_BASE =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FarmerRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        walletAddress: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must contain at least 6 characters.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE}/farmer/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                    walletAddress: formData.walletAddress.trim(),
                    role: 'Farmer'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Farmer registration failed.');
            }

            setSuccess('Farmer account created successfully! Redirecting to login...');

            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                walletAddress: ''
            });

            setTimeout(() => {
                window.location.href = '/farmer-login';
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-logo">
                    🌱 AgriTradeChain
                </div>

                <h2>Farmer Registration</h2>

                <p className="auth-subtitle">
                    Join AgriTradeChain and sell your crops directly
                </p>

                <form className="auth-form" onSubmit={handleRegister}>

                    {error && (
                        <div className="auth-error">{error}</div>
                    )}

                    {success && (
                        <div className="auth-success">{success}</div>
                    )}

                    <div className="auth-field">
                        <label>Farmer Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>MetaMask Wallet Address</label>
                        <input
                            type="text"
                            name="walletAddress"
                            placeholder="Enter your wallet address"
                            value={formData.walletAddress}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Register as Farmer'}
                    </button>

                </form>

                <div className="auth-footer">
                    Already registered?{' '}
                    <a href="/farmer-login">Login</a>
                </div>

                <a href="/" className="auth-back">
                    ← Back to Home
                </a>

            </div>
        </div>
    );
};

export default FarmerRegister;
