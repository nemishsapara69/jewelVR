import React from 'react';
import './LoadingOverlay.css';

export default function LoadingOverlay({ message = 'Loading AI models...' }) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-content">
        <div className="loading-logo">
          <span className="logo-jewel">✦</span>
          <span className="logo-text">JewelVR</span>
        </div>
        <div className="spinner-ring">
          <div className="spinner-dot" />
        </div>
        <p className="loading-message">{message}</p>
        <p className="loading-sub">Powered by MediaPipe · No data leaves your device</p>
      </div>
    </div>
  );
}
