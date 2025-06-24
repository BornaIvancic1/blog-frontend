import React, { useState, useEffect } from 'react';

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(dm => !dm)}
      className="dark-mode-btn"
    >
      <span className="material-icons">
        {darkMode ? 'light_mode' : 'dark_mode'}
      </span>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

export default DarkModeToggle;
