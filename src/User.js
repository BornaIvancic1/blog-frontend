import React, { useEffect, useState } from 'react';
import './SearchUsers.css'; // You can also import a grid CSS file if you have one

function User({ id, onBack }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);

  // Fetch user info
  useEffect(() => {
    if (!id || id === 'null' || id === 'undefined') {
      setError('No user selected.');
      setLoading(false);
      return;
    }

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
          setError(null);
        } else {
          setError(data.message || 'User not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading user');
        setLoading(false);
      });
  }, [id]);

  // Fetch posts by this user
  useEffect(() => {
    if (!id || id === 'null' || id === 'undefined') {
      setPosts([]);
      setLoadingPosts(false);
      setErrorPosts(null);
      return;
    }
    setLoadingPosts(true);
    setErrorPosts(null);
    fetch(`http://localhost:3000/api/posts/user/${id}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoadingPosts(false);
      })
      .catch(() => {
        setErrorPosts('Failed to load posts.');
        setLoadingPosts(false);
      });
  }, [id]);

  if (loading) return <div>Loading user...</div>;
  if (error) return (
    <div>
      <button className='btn-danger' onClick={onBack} style={{ marginBottom: 16 }}>
        <span className="material-icons">arrow_back</span> Back to search
      </button>
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      <button className='btn-danger' onClick={onBack} style={{ marginBottom: 16 }}>
        <span className="material-icons">arrow_back</span> Back to search
      </button>
      <h2>
        <span className="material-icons" style={{ verticalAlign: 'middle', color: '#38a3a5' }}>account_circle</span>
        {' '}
        {user.firstName} {user.lastName}
        <br />
        Username: {user.userName}
      </h2>

      {loadingPosts && <div>Loading posts...</div>}
      {errorPosts && <div style={{ color: 'red' }}>{errorPosts}</div>}
      {!loadingPosts && posts.length === 0 && <div>No posts found.</div>}
      <div className="grid-container">
        {posts.map(post => (
          <div className="grid-item" key={post._id}>
            <h4 style={{ margin: '0 0 8px 0' }}>{post.title}</h4>
            <div style={{ color: '#555', fontSize: 14, marginBottom: 8 }}>
              {post.createdAt && (new Date(post.createdAt).toLocaleDateString())}
            </div>
            <div style={{ marginBottom: 8 }}>
              {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>
              {post.tags && post.tags.length > 0 && (
                <>Tags: {post.tags.join(', ')}</>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default User;
