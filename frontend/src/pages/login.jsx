
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

function Login() {
    const [role, setRole] = useState('Farmer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

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

            login({
                id: userId,
                role: role,
                email: email
            });

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
        <main className="auth-page">
            <div className="auth-theme-toggle"><ThemeToggle /></div>
            <section className="auth-card">
                <div className="auth-brand">
                    <span className="auth-brand-mark" aria-hidden="true">🌾</span>
                    <span className="auth-brand-copy">
                        <span className="auth-wordmark">AgriTrade<span>Chain</span></span>
                        <span className="auth-caption">DECENTRALIZED ESCROW</span>
                    </span>
                </div>
                <h1 className="auth-title">Sign in</h1>

                <form className="auth-form" onSubmit={handleLogin}>
                    <fieldset className="auth-role-fieldset">
                        <legend>Sign in as</legend>
                        <div className="auth-role-choice">
                            {[
                                { value: 'Farmer', icon: '🧑‍🌾' },
                                { value: 'Customer', icon: '🛒' },
                                { value: 'Admin', icon: '⚡' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`auth-role-option${role === option.value ? ' active' : ''}`}
                                    aria-pressed={role === option.value}
                                    onClick={() => setRole(option.value)}
                                >
                                    <span aria-hidden="true">{option.icon}</span>
                                    <span>{option.value}</span>
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <label className="auth-field" htmlFor="login-email">
                        Email address
                        <input
                            id="login-email"
                            className="input-field"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <div className="auth-field">
                        <label htmlFor="login-password">Password</label>
                        <span className="auth-password-control">
                            <input
                                id="login-password"
                                className="input-field"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="auth-reveal-button"
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword(value => !value)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </span>
                    </div>

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {role !== 'Admin' && (
                    <p className="auth-footer">
                        Don&apos;t have an account?{' '}
                        <Link to={`/register?role=${role.toLowerCase()}`}>Register</Link>
                    </p>
                )}
            </section>
        </main>
    );
}

export default Login;
