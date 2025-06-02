import React, { useState } from 'react';
import './Login.css'; // We'll add styling here

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      onLogin(username);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
     <form className="login-form" onSubmit={handleSubmit}>
  <div className="input-row">
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
  </div>
  <div className="button-row">
    <button type="submit">Login</button>
  </div>
</form>


      <div className="image-container">
        <img
          src="https://via.placeholder.com/300x200" // Replace with your image URL or import
          alt="Login visual"
          className="login-image"
        />
      </div>
    </div>
  );
}

export default Login;
