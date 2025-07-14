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
        localStorage.setItem('token', data.token); // <--- Save the token!
    onLogin(data.user.userName, data.user.firstname, data.user.lastname);    }
    } catch (err) {
      setError('Network error');
    }

    setLoading(false);
  };
 const handleGoogle = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
    // Change the URL above to your actual Google OAuth endpoint
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

        <div className="login-input-row">
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
  {/* Google Register Button */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogle}
          
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
    alt="Google"
    style={{ width: 40, height: 40, marginRight: 8 }}
  />
  Login with Google
</button>
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
  Login with Microsoft
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
  Login with Apple
</button>
      </div>
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
