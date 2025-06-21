import React, { useEffect, useState } from 'react';

function User({ id, onBack }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   if (!id || id === 'null' || id === 'undefined') return;

    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          setError('User not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading user');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading user...</div>;
  if (error) return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 16 }}>← Back to search</button>
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      <button onClick={onBack} style={{ marginBottom: 16 }}>← Back to search</button>
      <h2>
        <span className="material-icons" style={{ verticalAlign: 'middle', color: '#38a3a5' }}>account_circle</span>
        {' '}
        {user.firstName} {user.lastName}
      </h2>
      <div style={{ color: '#555', marginBottom: 16 }}>@{user.userName}</div>
      <div>Email: {user.userName}</div>
      {/* Add more user details here as needed */}
    </div>
  );
}

export default User;
