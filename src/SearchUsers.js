import React, { useState } from 'react';
import './SearchUsers.css';

function SearchUsers({ onUserSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    setSearching(true);
    setError(null);
    setResults([]);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in.');
        return;
      }
      const res = await fetch(
        `http://localhost:3000/api/users/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Search failed');
      setResults(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  // Helper to get a unique user ID
  const getUserId = (user) => user.id || user._id;

  return (
    <div className="user-search-page">
      <h2 style={{ marginBottom: 20 }}>
        <span className="material-icons">person_search</span> Search Users
      </h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          id="search-users-input"
          name="search-users"
          className="search-users-input"
          type="text"
          placeholder="Enter username or name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1 }}
          autoFocus
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
        {results.length === 0 && !searching && hasSearched && (
          <div>No users found.</div>
        )}

        {results.map((user, idx) => {
          const userId = getUserId(user);
          return (
            <div
              key={userId || user.userName || idx}
              className="user-result"
              style={{
                background: '#f6ffff',
                borderRadius: 12,
                padding: 12,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 10px #e0f7fa',
                cursor: 'pointer'
              }}
              onClick={() => onUserSelect(userId)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onUserSelect(userId);
                }
              }}
              aria-label={`View details for ${user.firstName} ${user.lastName}`}
            >
              <span
                className="material-icons"
                style={{ fontSize: 36, marginRight: 12, color: '#38a3a5' }}
              >
                account_circle
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ color: '#555' }}>@{user.userName}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchUsers;
