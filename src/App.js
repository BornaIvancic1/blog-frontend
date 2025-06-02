import React, { useState } from 'react';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  return (
    <div className="App">
      {user ? (
        <h2>Welcome, {user}!</h2>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
