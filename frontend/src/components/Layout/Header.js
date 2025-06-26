import React from 'react';
// import './Header.css'; // If you have specific styles

function Header({ currentUser, onLogout, onShowLogin, onShowRegister }) {
    return (
        <header>
            <h1>HouseHunt</h1>
            <div className="user-auth-section">
                {currentUser ? (
                    <div id="user-info">
                        Logged in as: <strong>{currentUser.username}</strong>
                        <button onClick={onLogout}>Logout</button>
                    </div>
                ) : (
                    <div id="auth-forms">
                        <button onClick={onShowLogin}>Login</button>
                        <button onClick={onShowRegister}>Register</button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;