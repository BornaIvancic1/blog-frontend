import React, { useState } from 'react';
import Login from './Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleLogin = (username) => {
    setUser(username);
  };

  const openPost = (index) => {
    setSelectedPost({
      title: `Post Title ${index + 1}`,
      content: `Full content of post ${index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit...`,
      author: `User${index + 1}`,
      date: '2025-06-02',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedPost(null);
    }, 300); // Match the CSS animation duration
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

            {selectedPost && (
              <div
                className={`modal-overlay ${showModal ? 'fade-in' : 'fade-out'}`}
                onClick={handleCloseModal}
              >
                <div
                  className={`modal-content ${showModal ? 'slide-in' : 'slide-out'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2>{selectedPost.title}</h2>
                  <p>{selectedPost.content}</p>
                  <p><strong>{selectedPost.author}</strong> — {selectedPost.date}</p>
                  <button onClick={handleCloseModal}>Close</button>
                </div>
              </div>
            )}

            <div className="grid-container">
              {[...Array(16)].map((_, i) => (
                <div className="grid-item" key={i} onClick={() => openPost(i)}>
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

       {page === 'me' && (
  <div className="profile-page">
<h2 style={{ marginTop: '10px' }}>Your Profile</h2>
    <div className="profile-info ">
      <p><span className="font-semibold text-white/80">Username:</span> {user}</p>
      <p><span className="font-semibold text-white/80">Email:</span> {user.toLowerCase()}@example.com</p>
      <p><span className="font-semibold text-white/80">Joined:</span> June 2, 2025</p>
      <p><span className="font-semibold text-white/80">Status:</span> Active</p>
    </div>
  </div>
)}

      </main>

      <nav className="bottom-nav">
        <button onClick={() => setPage('home')}>
          <span className="material-icons">home</span> Home
        </button>
        <button onClick={() => setPage('me')}>
          <span className="material-icons">person</span> Me
        </button>
      </nav>
    </div>
  );
}

export default App;
