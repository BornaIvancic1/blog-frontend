import React, { useState } from 'react';
import Login from './Login';
import './App.css'; // Make sure this file exists

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');

  const handleLogin = (username) => {
    setUser(username);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
       <main className="main-content">
        {page === 'home' && (
          <>
            <h2>Welcome Home, {user}!</h2>
            <div className="grid-container">
             {[...Array(16)].map((_, i) => (
  <div className="grid-item" key={i}>
    <h3 className="grid-title">Post Title {i + 1}</h3>
    <p className="grid-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque...
    </p>
    <div className="grid-meta">
      <span className="grid-author">by User{i + 1}</span>
      <span className="grid-date">2025-06-02</span>
    </div>
  </div>
))}
            </div>
          </>
        )}
        {page === 'me' && <h2>This is your profile, {user}.</h2>}
      </main>

      <nav className="bottom-nav">
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('me')}>Me</button>
      </nav>
    </div>
  );
}

export default App;
