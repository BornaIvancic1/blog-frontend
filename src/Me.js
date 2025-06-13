import React from 'react';

function Me({ user }) {
  return (
    <div className="profile-page">
      <h2 style={{ marginBottom: '20px' }}>
        <span className="material-icons">face</span> Your Profile</h2>
      <div className="profile-info">
                    <p className="profile-text">
          <span className="profile-label"> 
            <span className="material-icons">account_circle</span> First Name:</span>
          <span className="profile-value"> {user.firstName}</span>
        </p>
        <p className="profile-text">
          <span className="profile-label">
            <span className="material-icons">badge</span> Last Name:</span>
          <span className="profile-value"> {user.lastName}</span>
        </p>
        <p className="profile-text">
          <span className="profile-label">
            <span className="material-icons">person</span> Username:</span>
          <span className="profile-value"> {user.userName}</span>
        </p>
        
        <p className="profile-text">
          <span className="profile-label">
            <span className="material-icons">calendar_today</span> Joined:</span>
          <span className="profile-value"> June 2, 2025</span>
        </p>
        <p className="profile-text">
          <span className="profile-label">
             <span className="material-icons">check_circle</span> Status:</span>
          <span className="profile-value"> Active</span>
        </p>
      </div>
    </div>
  );
}

export default Me;
