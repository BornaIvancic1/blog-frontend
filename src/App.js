import React, { useState, useEffect } from 'react';
import Login from './Login';
import Me from './Me';
import Register from './Register';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errorPosts, setErrorPosts] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoadingPosts(true);
    fetch('http://localhost:3000/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoadingPosts(false);
      })
      .catch(err => {
        setErrorPosts('Failed to load posts');
        setLoadingPosts(false);
      });
  }, [user]);

  const handleLogin = (userName, firstName, lastName) => {
    setUser({ userName, firstName, lastName });
  };

  const handleRegister = (userName, firstName, lastName) => {
    setUser({ userName, firstName, lastName });
  };

  const openPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedPost(null);
    }, 300);
  };

  // --- Create Post Modal Form ---
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [createError, setCreateError] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create post');
      setPosts([data, ...posts]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
    } catch (err) {
      setCreateError(err.message);
    }
    setCreating(false);
  };

  if (!user) {
    return showRegister ? (
      <Register
        onRegister={handleRegister}
        switchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        switchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="app">
      {page === 'home' && (
        <button
          className="create-post-btn"
          style={{
            position: 'absolute',
            top: 20,
            right: 40,
            zIndex: 10
          }}
          onClick={() => setShowCreateModal(true)}
        >
         <span className="material-icons" >add_circle</span> Create Post
        </button>
      )}

      <main className="main-content">
        {page === 'home' && (
          <>
            <h2><span className="material-icons">waving_hand</span> Welcome Home, {user.userName}!</h2>

            {/* Create Post Modal */}
            {showCreateModal && (
              <div className="modal-overlay fade-in" onClick={() => setShowCreateModal(false)}>
                <div
                  className="modal-content slide-in"
                  onClick={e => e.stopPropagation()}
                >
                  <h3>Create New Post</h3>
                  <form onSubmit={handleCreatePost}>
                    {createError && <p style={{ color: 'red' }}>{createError}</p>}
                    <input
                      type="text"
                      placeholder="Post Title"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      required
                    />
                    <textarea
                      placeholder="Post Content"
                      value={newContent}
                      onChange={e => setNewContent(e.target.value)}
                      required
                      rows={5}
                    />
                              <div className="modal-buttons">
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
            </div>

                  </form>
                </div>
              </div>
            )}

            {/* View Post Modal */}
            {selectedPost && (
              <div
                className={`modal-overlay ${showModal ? 'fade-in' : 'fade-out'}`}
                onClick={handleCloseModal}
              >
                <div
                  className={`modal-content ${showModal ? 'slide-in' : 'slide-out'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>{selectedPost.title}</h3>
                  <p>{selectedPost.content}</p>
                  <p>
                    <strong>{selectedPost.author?.userName || 'Unknown'}</strong> — {selectedPost.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString() : ''}
                  </p>
                  <button onClick={handleCloseModal}>Close</button>
                </div>
              </div>
            )}

            {/* Posts Grid */}
            <div className="grid-container">
              {loadingPosts && <p>Loading posts...</p>}
              {errorPosts && <p style={{ color: 'red' }}>{errorPosts}</p>}
              {posts.map((post) => (
                <div className="grid-item" key={post._id} onClick={() => openPost(post)}>
                  <h3 className="grid-title">{post.title}</h3>
                  <p className="grid-content">
                    {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
                  </p>
                  <div className="grid-meta">
                    <span className="grid-author">by {post.author?.userName || 'Unknown'}</span>
                    <span className="grid-date">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 'me' && <Me user={user} />}
      </main>

      <nav className="bottom-nav">
        <button onClick={() => setPage('home')}>
          <span className="material-icons">home</span> Home
        </button>
        <button onClick={() => setPage('me')}>
          <span className="material-icons">person</span> Me
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            setUser(null);
            setPage('login');
          }}
        >
          <span className="material-icons">logout</span> Logout
        </button>
      </nav>
    </div>
  );
}

export default App;
