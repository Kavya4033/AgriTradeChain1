
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [role, setRole] = useState('Farmer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:5000/api/${role.toLowerCase()}/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            const userId =
                data.farmerId || data.customerId || data.adminId;

            if (!userId) {
                throw new Error('User ID was not returned by the server');
            }

            localStorage.setItem('agriUser', JSON.stringify({
                id: userId,
                role: role,
                email: email
            }));

            if (role === 'Farmer') {
                navigate('/farmer/dashboard');
            } else if (role === 'Customer') {
                navigate('/customer/dashboard');
            } else {
                navigate('/admin/dashboard');
            }

        } catch (err) {
            setError(err.message || 'Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f0f4f0'
        }}>
            <div style={{
                width: '350px',
                padding: '30px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', color: '#287a35' }}>
                    AgriTradeChain
                </h2>

                <h3 style={{ textAlign: 'center' }}>Login</h3>

                <form onSubmit={handleLogin}>
                    <label>Select Login Type</label>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="Farmer">Farmer</option>
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    {error && (
                        <p style={{ color: 'red' }}>{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={buttonStyle}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {role !== 'Admin' && (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        Don't have an account?{' '}
                        <Link to={`/register?role=${role.toLowerCase()}`}>
                            Register
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '8px 0 15px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '5px'
};

const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: '#287a35',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
};

export default Login;
