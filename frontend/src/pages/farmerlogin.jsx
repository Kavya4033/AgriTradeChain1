
import React, { useState } from 'react';
import '../styles/Auth.css';

const API_BASE =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FarmerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE}/farmer/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Farmer login failed.');
            }

            if (data.role && data.role !== 'Farmer') {
                throw new Error('This account is not registered as a farmer.');
            }

            const farmerId =
                data.farmerId || data.userId || data._id;

            const farmerUser = {
                id: farmerId,
                farmerId,
                role: data.role || 'Farmer',
                email: email.trim().toLowerCase(),
                token: data.token || null
            };

            localStorage.setItem('agriUser', JSON.stringify(farmerUser));

            window.location.href = '/farmer-dashboard';

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

                <h2>Farmer Login</h2>

                <p className="auth-subtitle">
                    Manage your crops and agricultural listings
                </p>

                <form className="auth-form" onSubmit={handleLogin}>

                    {error && (
                        <div className="auth-error">{error}</div>
                    )}

                    <div className="auth-field">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <label>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                        />{' '}
                        Show password
                    </label>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Login as Farmer'}
                    </button>

                </form>

                <div className="auth-footer">
                    New farmer?{' '}
                    <a href="/farmer-register">Register</a>
                </div>

                <a href="/" className="auth-back">
                    ← Back to Home
                </a>

            </div>
        </div>
    );
};

export default FarmerLogin;