import React, { useState } from 'react';
// import authService from '../services/authService';
import authService from '../../services/authService';

function LoginModal({ onClose, onLoginSuccess, onSwitchToRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userData = await authService.login({ username, password });
            onLoginSuccess(userData); // Pass user data up to App.js
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="login-modal" className="modal auth-modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>×</span>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="login-username">Username:</label>
                    <input type="text" id="login-username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    
                    <label htmlFor="login-password">Password:</label>
                    <input type="password" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    
                    {error && <p className="auth-message error">{error}</p>}
                    <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                    <p style={{textAlign: 'center', marginTop: '10px'}}>
                        Don't have an account? <button type="button" className="link-button" onClick={onSwitchToRegister}>Register here</button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;