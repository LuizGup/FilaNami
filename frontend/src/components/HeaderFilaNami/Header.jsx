import React from 'react';

function Header({ appName = 'App', iconClass = '' }) {
  return (
    <nav className="navbar bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center gap-2" href="/">
          <i className={`${iconClass} text-primary`} aria-hidden="true"></i>
          <span className="fw-semibold">{appName}</span>
        </a>
      </div>
    </nav>
  );
}

export default Header;
