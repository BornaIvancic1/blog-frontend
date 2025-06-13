import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin, switchToRegister }) {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userName: userName, password:password }),
      });

      const data = await res.json();

      // FIX 1: Use data.message for error (matches backend)
      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
      } else {
        // FIX 2: Just use the username, since backend only returns token
      onLogin(data.user.userName, data.user.firstname, data.user.lastname);      }
    } catch (err) {
      setError('Network error');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="image-container">
          <img
            src="/logo.png"
            alt="Login visual"
            className="login-image"
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="input-row">
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <p style={{ marginTop: 10 }}>
        Don't have an account?{' '}
        <button
          onClick={switchToRegister}
         className='registerLogin'
        >
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;
