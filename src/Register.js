import React, { useState } from 'react';
import './Login.css';
import { GoogleLogin } from '@react-oauth/google';

function Register({ onRegister, switchToLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, userName, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setSuccess(true);
        if (onRegister) onRegister(userName);
      }
    } catch (err) {
      setError('Network error');
    }

    setLoading(false);
  };

  // Handle Google register with token
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/users/register/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Google registration failed');
      } else {
        setSuccess(true);
        if (onRegister) onRegister(data.user?.userName || 'Google user');
      }
    } catch (err) {
      setError('Google registration failed (network error)');
    }
    setLoading(false);
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed.');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="image-container">
          <img
            src="/logo.png"
            alt="Register visual"
            className="login-image"
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Registration successful! You can now log in.</p>}

        <div className="input-row">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={userName}
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
        </div>

        <div className="button-row">
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      {/* OAuth Buttons */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        
        />

        <button
          type="button"
          className="microsoft-btn"
          onClick={() => window.location.href = 'http://localhost:3000/api/auth/microsoft'}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            alt="Microsoft"
            style={{ width: 40, height: 40, marginRight: 8 }}
          />
          Register with Microsoft
        </button>

        <button
          type="button"
          className="apple-btn"
          onClick={() => window.location.href = 'http://localhost:3000/api/auth/apple'}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="Apple"
            style={{ width: 35, height: 40, marginRight: 8 }}
          />
          Register with Apple
        </button>
      </div>

      <p style={{ marginTop: 10 }}>
        Already have an account?{' '}
        <button
          onClick={switchToLogin}
          className='registerLogin'
        >
          Log in here
        </button>
      </p>
    </div>
  );
}

export default Register;
