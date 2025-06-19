import React, { useState, useEffect } from 'react';

function Me({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showInputs, setShowInputs] = useState(false); // Controls rendering
  const [fadeClass, setFadeClass] = useState(''); // Controls class
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [userName, setUserName] = useState(user?.userName || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setUserName(user?.userName || '');
  }, [user]);

  // Handle fade-in/fade-out logic
  useEffect(() => {
    if (isEditing) {
      setShowInputs(true);
      setFadeClass('fade-in');
    } else if (showInputs) {
      setFadeClass('fade-out');
      const timeout = setTimeout(() => setShowInputs(false), 200); // match animation
      return () => clearTimeout(timeout);
    }
}, [isEditing, showInputs]); // <-- add showInputs

  if (!user) return <div>Loading...</div>;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/users/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, userName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      if (onUpdateUser) onUpdateUser(data.user);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setUserName(user.userName || '');
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="profile-page">
      <h2 style={{ marginBottom: '20px' }}>
        <span className="material-icons">face</span> Your Profile
      </h2>
      <div className="profile-info">
        <p className="profile-text">
          <span className="profile-label">
            <span className="material-icons">account_circle</span> First Name:
          </span>
          {showInputs ? (
            <input
              className={fadeClass}
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          ) : (
            <span className="profile-value">{user.firstName}</span>
          )}
        </p>
        <p className="profile-text">
          <span className="profile-label">
            <span className="material-icons">badge</span> Last Name:
          </span>
          {showInputs ? (
            <input
              className={fadeClass}
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          ) : (
            <span className="profile-value">{user.lastName}</span>
          )}
        </p>
        <p className="profile-text">
          <span className="profile-label">
            <span className="material-icons">person</span> Username:
          </span>
          {showInputs ? (
            <input
              className={fadeClass}
              value={userName}
              onChange={e => setUserName(e.target.value)}
            />
          ) : (
            <span className="profile-value">{user.userName}</span>
          )}
        </p>
        <p className="profile-text">
          <span className="profile-label">
            <span className="material-icons">calendar_today</span> Joined:
          </span>
          <span className="profile-value"> June 2, 2025</span>
        </p>
        <p className="profile-text">
          <span className="profile-label">
            <span className="material-icons">check_circle</span> Status:
          </span>
          <span className="profile-value"> Active</span>
        </p>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {showInputs ? (
          <div style={{ marginTop: 20 }}>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="btn-secondary" onClick={handleCancel} disabled={saving} style={{ marginLeft: 10 }}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => setIsEditing(true)} style={{ marginTop: 20 }}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default Me;
