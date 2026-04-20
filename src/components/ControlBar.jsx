import React from 'react';
import './ControlBar.css';

export default function ControlBar({
  mode,
  onModeChange,
  mirrored,
  onMirrorToggle,
  onScreenshot,
  hasDetection,
}) {
  return (
    <div className="control-bar" role="toolbar" aria-label="Camera controls">
      {/* Mode switcher */}
      <div className="mode-switcher">
        <button
          id="btn-live"
          className={`mode-btn ${mode === 'live' ? 'active' : ''}`}
          onClick={() => onModeChange('live')}
          title="Live Webcam"
        >
          <span className="btn-icon">📷</span>
          <span className="btn-label">Live Cam</span>
        </button>
        <button
          id="btn-upload"
          className={`mode-btn ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => onModeChange('upload')}
          title="Upload Photo / Video"
        >
          <span className="btn-icon">🖼️</span>
          <span className="btn-label">Upload</span>
        </button>
      </div>

      {/* Spacer */}
      <div className="control-spacer" />

      {/* Detection status pill */}
      <div className={`detection-pill ${hasDetection ? 'detected' : 'searching'}`}>
        <span className="pill-dot" />
        <span className="pill-label">{hasDetection ? 'Face detected' : 'Searching...'}</span>
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        {mode === 'live' && (
          <button
            id="btn-mirror"
            className="action-btn"
            onClick={onMirrorToggle}
            title="Flip camera"
          >
            <span>🔄</span>
            <span className="btn-label">Flip</span>
          </button>
        )}
        <button
          id="btn-screenshot"
          className="action-btn accent"
          onClick={onScreenshot}
          title="Take screenshot"
        >
          <span>📸</span>
          <span className="btn-label">Screenshot</span>
        </button>
      </div>
    </div>
  );
}
