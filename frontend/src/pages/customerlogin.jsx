
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const API_BASE =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function CustomerLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please enter your email and password.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE}/customer/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed.');
            }

            const customerId = data.customerId || data._id;

            if (!customerId) {
                throw new Error('Customer ID was not returned by the server.');
            }

            const userData = {
                id: customerId,
                customerId,
                name: data.name || '',
                email: formData.email.trim().toLowerCase(),
                role: data.role || 'Customer',
                token: data.token || ''
            };

            localStorage.setItem('agriUser', JSON.stringify(userData));

            alert('Customer login successful!');

            navigate('/customer-dashboard');

        } catch (err) {
            setError(err.message || 'Unable to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Customer Login</h2>
                <p>Login to your AgriTradeChain account</p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
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

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/customer-register">
                        Register here
                    </Link>
                </p>

                <p className="auth-footer">
                    <Link to="/">Back to Home</Link>
                </p>
            </div>
        </div>
    );
}

export default CustomerLogin;