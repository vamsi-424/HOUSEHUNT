import React, { useState } from 'react';
import authService from '../../services/authService';

function RegisterModal({ onClose, onRegisterSuccess, onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            await authService.register({ username, password });
            onRegisterSuccess(); // Inform App.js, which might open login modal
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="register-modal" className="modal auth-modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>×</span>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="register-username">Username:</label>
                    <input type="text" id="register-username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    
                    <label htmlFor="register-password">Password:</label>
                    <input type="password" id="register-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    
                    <label htmlFor="register-confirm-password">Confirm Password:</label>
                    <input type="password" id="register-confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    
                    {error && <p className="auth-message error">{error}</p>}
                    <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                     <p style={{textAlign: 'center', marginTop: '10px'}}>
                        Already have an account? <button type="button" className="link-button" onClick={onSwitchToLogin}>Login here</button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterModal;