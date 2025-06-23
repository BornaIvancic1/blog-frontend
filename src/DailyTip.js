import React, { useState } from 'react';
import Modal from './Modal';

function DailyTip() {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTip = async () => {
    setLoading(true);
    setTip('');
    try {
      const res = await fetch('http://localhost:3000/api/chat/getDailyTip', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }); // Adjust endpoint as needed
      const data = await res.json();
      setTip(data.tip);
    } catch {
      setTip('Could not fetch tip. Try again later.');
    }
    setLoading(false);
  };

  const handleOpen = () => {
    setOpen(true);
    fetchTip();
  };

  return (
    <>
      <button
        className="daily-tip-btn"
        style={{
          position: 'absolute',
          top: 80,
          left: 40,
          zIndex: 10
        }}
        onClick={handleOpen}
      >
        <span className="material-icons">tips_and_updates</span>
        <span className="btn-text">Daily Tip</span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h3>Daily Tip</h3>
        <div className="tip-text" style={{ minHeight: 40 }}>
          {loading ? 'Loading...' : tip}
        </div>
      </Modal>
    </>
  );
}

export default DailyTip;
