import React, { useState, useEffect } from 'react';
import Login from './Login';
import Me from './Me';
import Register from './Register';
import './App.css';
import SearchUsers from './SearchUsers';
import User from './User';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [showChat, setShowChat] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // For create modal
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [createError, setCreateError] = useState(null);
  const [creating, setCreating] = useState(false);

const [paraphrasingTitle, setParaphrasingTitle] = useState(false);
const [paraphrasingContent, setParaphrasingContent] = useState(false);
const [searchTerm, setSearchTerm] = useState('');

      const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editTags, setEditTags] = useState('');
const [chatInput, setChatInput] = useState('');
const [chatMessages, setChatMessages] = useState([]);
const [chatLoading, setChatLoading] = useState(false);
const [chatError, setChatError] = useState(null);

const handleParaphraseTitle = async () => {
  setParaphrasingTitle(true);
  try {
    const res = await fetch('http://localhost:3000/api/chat/paraphrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTitle, type: 'title' }),
    });
    const data = await res.json();
    if (data.improvedText) setNewTitle(data.improvedText);
  } catch (err) {
    // Optionally handle error
  }
  setParaphrasingTitle(false);
};

const handleParaphraseContent = async () => {
  setParaphrasingContent(true);
  try {
    const res = await fetch('http://localhost:3000/api/chat/paraphrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newContent, type: 'content' }),
    });
    const data = await res.json();
    if (data.improvedText) setNewContent(data.improvedText);
  } catch (err) {
    // Optionally handle error
  }
  setParaphrasingContent(false);
};



const handleSendChat = async () => {
  if (!chatInput.trim()) return;
  setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
  setChatLoading(true);
  setChatError(null);
  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: chatInput }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'AI error');
    setChatMessages(msgs => [...msgs, { sender: 'ai', text: data.reply }]);
    setChatInput('');
  } catch (err) {
    setChatError(err.message);
  }
  setChatLoading(false);
};

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
const handleEditPost = () => {
  setEditTitle(selectedPost.title);
  setEditContent(selectedPost.content);
  setEditTags(selectedPost.tags.join(', '));
  setIsEditing(true);
};



  const handleRegister = (userName, firstName, lastName) => {
    setUser({ userName, firstName, lastName });
  };
const handleDeletePost = () => setShowDeleteConfirm(true);

const confirmDeletePost = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/posts/${selectedPost._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Failed to delete post');
    setPosts(posts.filter(p => p._id !== selectedPost._id));
    setShowModal(false);
    setShowDeleteConfirm(false);
    setSelectedPost(null); 
  } catch (err) {
    alert(err.message);
  }
};

const handleUpdatePost = async (e) => {
  e.preventDefault();
  // Validation as needed
  const tagsArr = editTags.split(',').map(tag => tag.trim()).filter(tag => tag);
  try {
    const res = await fetch(`http://localhost:3000/api/posts/${selectedPost._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title: editTitle, content: editContent, tags: tagsArr })
    });
    if (!res.ok) throw new Error('Failed to update post');
    const updated = await res.json();
    setPosts(posts.map(p => p._id === updated._id ? updated : p));
    setIsEditing(false);
    setShowModal(false);
  } catch (err) {
    alert(err.message);
  }
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
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreateError(null);

    // Frontend validation (no minimum length)
    if (!newTitle.trim() || newTitle.length > 120) {
      setCreateError('Title must be 1-120 characters.');
      return;
    }
    if (!newContent.trim()) {
      setCreateError('Content cannot be empty.');
      return;
    }
    const tagsArr = newTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    if (tagsArr.length > 5) {
      setCreateError('Maximum 5 tags allowed.');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle, content: newContent, tags: tagsArr })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create post');
      setPosts([data, ...posts]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
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
         <span className="material-icons" >add_circle</span> 
         <span className="btn-text"> Create Post</span>
        </button>
      )}
      {page === 'home' && (
        <button
          className="search-users-btn"
          style={{
            position: 'absolute',
            top: 80,
            right: 40,
            zIndex: 10
          }}
          onClick={() => setPage('searchUsers')}
        >
         <span className="material-icons" >person_search</span> 
          <span className="btn-text"> Search Users</span>
        </button>
      )}
{page === 'home' && (
        <button
          className="talk-ai-btn"
          style={{
            position: 'absolute',
            top: 20,
            left: 40,
            zIndex: 10
          }}
          onClick={() => setShowChat(true)}
        >
  <span className="material-icons">auto_awesome</span> 
  <span className="btn-text"> Chat with AI</span>
        </button>
      )}
      {showChat && (
  <div className="modal-overlay" onClick={() => setShowChat(false)}>
    <div className="modal-content ai" onClick={e => e.stopPropagation()}>
      <h3>Chat with AI</h3>
        <div className='aiDiv' style={{  overflowY: 'auto', marginBottom: 10, display: 'flex', flexDirection: 'column' }}>
      {chatMessages.map((msg, idx) => (
        <div
          key={idx}
          className={msg.sender === 'user' ? 'userMessage' : 'aiMessage'}
          style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
        >
          <span>{msg.text}</span>
        </div>
      ))}

        {chatLoading && <div>AI is typing...</div>}
        {chatError && <div style={{ color: 'red' }}>{chatError}</div>}
      </div>
      <input
        type="text"
        value={chatInput}
        onChange={e => setChatInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSendChat()}
        placeholder="Type your message..."
        style={{ width: '80%' }}
        disabled={chatLoading}
      />
      <button style={{marginLeft:'20px'}} className='btn-primary' onClick={handleSendChat} disabled={chatLoading}>Send</button>
      <button className="btn-secondary" onClick={() => setShowChat(false)}>Close</button>
    </div>
  </div>
)}

      <main className="main-content">
        {page === 'home' && (
          <>
            <h2><span className="material-icons">waving_hand</span> Welcome Home, {user.userName}!</h2>
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <input
  className='search-input'
    type="text"
    placeholder="Search posts..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    style={{ flex: 1, padding: '8px', fontSize: '1em' }}
  />
</div>

            {/* Create Post Modal */}
            {showCreateModal && (
              <div className="modal-overlay fade-in" onClick={() => setShowCreateModal(false)}>
                <div
                  className="modal-content slide-in"
                  onClick={e => e.stopPropagation()}
                >
                  <h3>Create New Post</h3>
                        <form onSubmit={handleCreatePost}>
          {createError && <p style={{ color: 'red', textAlign: 'center' }}>{createError}</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              placeholder="Post Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              required
              maxLength={120}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleParaphraseTitle}
              disabled={paraphrasingTitle}
              className="btn-tertiary talk-ai-btn"
              title="Paraphrase/Fix Grammar"
            >
              <span className="material-icons">auto_awesome</span> {paraphrasingTitle ? '...' : 'Paraphrase Title'}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <textarea
              placeholder="Post Content"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              required
              rows={5}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleParaphraseContent}
              disabled={paraphrasingContent}
              className="btn-tertiary talk-ai-btn"
              title="Paraphrase/Fix Grammar"
            >
              <span className="material-icons">auto_awesome</span> {paraphrasingContent ? '...' : 'Paraphrase Content'}
            </button>
          </div>
          <input
            type="text"
            placeholder="Tags (comma separated, max 5)"
            value={newTags}
            onChange={e => setNewTags(e.target.value)}
            maxLength={100}
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
                  <p style={{ marginBottom: '10px' }}>{selectedPost.content}</p>
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div style={{ margin: '10px' }}>
                      <strong>Tags:</strong> {selectedPost.tags.join(', ')}
                    </div>
                  )}
                  <p>
                    <strong>{selectedPost.author?.userName || 'Unknown'}</strong> — {selectedPost.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString() : ''}
                  </p>
                 <div className="modal-buttons">
                {user.userName === selectedPost.author?.userName && (
                  <>
                    <button className="btn-primary" onClick={handleEditPost}>Edit</button>
                    <button className="btn-danger" onClick={handleDeletePost}>Delete</button>
                  </>
                )}
                <button className="btn-secondary" onClick={handleCloseModal}>Close</button>
        </div>

                </div>
              </div>
            )}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h4>Confirm Delete</h4>
              <p>Are you sure you want to delete this post?</p>
              <div className="modal-buttons">
                <button className="btn-danger" onClick={confirmDeletePost}>Delete</button>
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
{isEditing && (
  <div className="modal-overlay" onClick={() => setIsEditing(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <h3>Edit Post</h3>
      <form onSubmit={handleUpdatePost}>
        <input
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          maxLength={120}
          required
        />
        <textarea
          rows={5}
          value={editContent}
          onChange={e => setEditContent(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={editTags}
          onChange={e => setEditTags(e.target.value)}
        />
        <div className="modal-buttons">
          <button type="submit" className="btn-primary">Update</button>
          <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}

            {/* Posts Grid */}
           <div className="grid-container">
  {loadingPosts && <p>Loading posts...</p>}
  {errorPosts && <p style={{ color: 'red' }}>{errorPosts}</p>}
  {posts
    .filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tags && post.tags.join(', ').toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .map((post) => (
      <div className="grid-item" key={post._id} onClick={() => openPost(post)}>
        <h3 className="grid-title">{post.title}</h3>
        <p className="grid-content">
          {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
        </p>
        <div className="grid-meta">
          <span className="grid-author">by {post.author?.userName || 'Unknown'}</span>
          <span className="grid-date">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: 6, fontSize: '0.9em', color: '#1976d2' }}>
            Tags: {post.tags.join(', ')}
          </div>
        )}
      </div>
    ))}
</div>
          </>
        )}

        {page === 'me' && <Me user={user} onUpdateUser={setUser} />}
               {page === 'searchUsers' && selectedUserId === null && (
  <SearchUsers onUserSelect={id => setSelectedUserId(id)} />
)}
{page === 'searchUsers' && selectedUserId !== null && (
  <User
    id={selectedUserId}
    onBack={() => setSelectedUserId(null)}
  />
)}



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
