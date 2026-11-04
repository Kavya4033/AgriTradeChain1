
import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

function Register() {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') === 'customer' ? 'Customer' : 'Farmer';

    const [role, setRole] = useState(initialRole);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                <h1 className="auth-title">Create account</h1>

                <form className="auth-form" onSubmit={handleRegister}>
                    <fieldset className="auth-role-fieldset">
                        <legend>Register as</legend>
                        <div className="auth-role-choice">
                            {[
                                { value: 'Farmer', icon: '🧑‍🌾' },
                                { value: 'Customer', icon: '🛒' }
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

                    <label className="auth-field" htmlFor="register-name">
                        Full name
                        <input id="register-name" className="input-field" type="text" autoComplete="name" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required />
                    </label>

                    <label className="auth-field" htmlFor="register-email">
                        Email address
                        <input id="register-email" className="input-field" type="email" autoComplete="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </label>

                    <div className="auth-field">
                        <label htmlFor="register-password">Password</label>
                        <span className="auth-password-control">
                            <input id="register-password" className="input-field" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} required />
                            <button type="button" className="auth-reveal-button" aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
                        </span>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-confirm-password">Confirm password</label>
                        <span className="auth-password-control">
                            <input id="register-confirm-password" className="input-field" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            <button type="button" className="auth-reveal-button" aria-pressed={showConfirmPassword} onClick={() => setShowConfirmPassword(value => !value)}>{showConfirmPassword ? 'Hide' : 'Show'}</button>
                        </span>
                    </div>

                    <label className="auth-field" htmlFor="register-wallet">
                        MetaMask wallet address
                        <input id="register-wallet" className="input-field" type="text" autoComplete="off" placeholder="Enter your wallet address" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} required />
                    </label>

                    {role === 'Farmer' && (
                        <label className="auth-field" htmlFor="register-location">
                            Farm location
                            <input id="register-location" className="input-field" type="text" autoComplete="address-level2" placeholder="Enter farm location" value={location} onChange={e => setLocation(e.target.value)} required />
                        </label>
                    )}

                    {error && <p className="auth-error" role="alert">{error}</p>}
                    {message && <p className="auth-success" role="status">{message}</p>}

                    <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
            </section>
        </main>
    );
}

export default Register;
