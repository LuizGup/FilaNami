import React, { useState } from 'react';

function MenuCard({ title, description, icon = '', onClick }) {
  const [hover, setHover] = useState(false);

  const baseStyle = {
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    transform: hover ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: hover
      ? '0 12px 30px rgba(0,0,0,0.10)'
      : '0 6px 18px rgba(0,0,0,0.06)',
    minHeight: '170px',
    padding: '1.25rem',
    borderRadius: '0.75rem',
  };

  return (
    <div
      role={onClick ? 'button' : 'article'}
      tabIndex={0}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(e);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="text-decoration-none text-body"
      style={{ display: 'block', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="card h-100 border-0" style={baseStyle}>
        <div className="d-flex align-items-start gap-3 h-100">
          <div className="flex-shrink-0 d-flex align-items-start">
            <i className={`${icon} fs-1 text-primary`} aria-hidden="true"></i>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <h5 className="mb-1 fw-bold fs-5">{title}</h5>
            <p className="text-muted mb-0 small">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
