// AuthPopup.js
import React, { useState } from 'react';
import './Auth.css'; // Ensure this CSS file is correctly linked

const AuthPopup = ({ onClose }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null); // State to store the user ID

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),

      });

      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId); // Store the user ID from response
        console.log('User ID:', data.userId); // Print the user ID in the console
        alert('Operation successful');
        onClose();
      } else {
        alert('Failed to authenticate');
      }
    } catch (error) {
      console.error('Error during authentication:', error); // Log any errors
      alert('An error occurred');
    }
  };

  const handleContinueAsGuest = () => {
    onClose(); 
  };

  return (
    <div className="auth-popup">
      <div className="auth-popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        </form>
        {userId && <p>Your user ID is: {userId}</p>} {/* Display user ID */}
        <p>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
        <button className="guest-button" onClick={handleContinueAsGuest}>Continue as Guest</button>
      </div>
    </div>
  );
};

export default AuthPopup;
