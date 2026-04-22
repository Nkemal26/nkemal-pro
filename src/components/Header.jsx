import React from 'react';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <h1 className="title">PROJECT <span className="accent">SAM</span></h1>
        <div className="status-badge">
          <span className="pulse-dot"></span>
          CORE ACTIVE
        </div>
      </div>
      <p className="subtitle">AI HUMAN INTELLIGENCE SIMULATION</p>
    </header>
  );
};

export default Header;
