import React, { useState } from 'react';
import './SearchUsers.css'; // Assuming you have a CSS file for styles

function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async e => {
    e.preventDefault();
    setSearching(true);
    setError(null);
    setResults([]);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Search failed');
      setResults(data.users || []);
    } catch (err) {
      setError(err.message);
    }
    setSearching(false);
  };

  return (
    <div className="user-search-page">
      <h2 style={{ marginBottom: '20px' }}>
        <span className="material-icons">person_search</span> Search Users
      </h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
        className='search-users-input'
          type="text"
          placeholder="Enter username or name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          className="search-users-btn"
          disabled={searching || !query.trim()}
        >
          <span className="material-icons">search</span>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <div>
        {results.length === 0 && !searching && query && <div>No users found.</div>}
        {results.map(user => (
          <div key={user.id} className="user-result" style={{
            background: '#f6ffff',
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 10px #e0f7fa'
          }}>
            <span className="material-icons" style={{ fontSize: 36, marginRight: 12, color: '#38a3a5' }}>account_circle</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{user.firstName} {user.lastName}</div>
              <div style={{ color: '#555' }}>@{user.userName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchUsers;
