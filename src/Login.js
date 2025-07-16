import React, { useState } from 'react';
import './Login.css';
import { GoogleLogin } from '@react-oauth/google';
import SimpleOAuth2Login from 'react-simple-oauth2-login';

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
        body: JSON.stringify({ userName, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials');
      } else {
        localStorage.setItem('token', data.token);
        onLogin(data.user.userName, data.user.firstname, data.user.lastname);
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/api/users/login/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Google login failed');
      } else {
        localStorage.setItem('token', data.token);
        onLogin(data.user.userName, data.user.firstname, data.user.lastname);
      }
    } catch (err) {
      setError('Google login failed (network error)');
    }
    setLoading(false);
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed.');
  };

  const handleGithubSuccess = async (response) => {
    const code = response.code;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/api/users/login/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'GitHub login failed');
      } else {
        localStorage.setItem('token', data.token);
        onLogin(data.user.userName, data.user.firstname, data.user.lastname);
      }
    } catch (err) {
      setError('GitHub login failed (network error)');
    }
    setLoading(false);
  };

  const handleGithubFailure = (response) => {
    setError('GitHub login was cancelled or failed.');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="image-container">
          <img src="/logo.png" alt="Login visual" className="login-image" />
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

      {/* OAuth Buttons */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} width="100%" />

        <button
          type="button"
          className="microsoft-btn"
          onClick={() => (window.location.href = 'http://localhost:3000/api/auth/microsoft')}
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
          onClick={() => (window.location.href = 'http://localhost:3000/api/auth/apple')}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="Apple"
            style={{ width: 35, height: 40, marginRight: 8 }}
          />
          Login with Apple
        </button>

        <SimpleOAuth2Login
          authorizationUrl="https://github.com/login/oauth/authorize"
          clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
          redirectUri="http://localhost:3001/oauth2/callback"
          responseType="code"
          scope="user:email"
          className='github-btn'
          buttonText={
            <>
              <img
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                alt="GitHub"
                style={{ borderRadius: 30, width: 24, height: 24, marginRight: 8, verticalAlign: 'middle' }}
              />
              Login with GitHub
            </>
          }
          onSuccess={handleGithubSuccess}
          onFailure={handleGithubFailure}
          style={{ marginTop: 15 }}
        />
      </div>

      <p style={{ marginTop: 10 }}>
        Don't have an account?{' '}
        <button onClick={switchToRegister} className="registerLogin">
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;
