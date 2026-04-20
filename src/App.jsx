import React, { useState, useRef, useCallback } from 'react';
import LoadingOverlay from './components/LoadingOverlay.jsx';
import OrnamentSelector from './components/OrnamentSelector.jsx';
import ControlBar from './components/ControlBar.jsx';
import CameraView from './components/CameraView.jsx';
import ThreeARCanvas from './components/ThreeARCanvas.jsx';
import ChatAssistant from './components/ChatAssistant.jsx';
import { useFaceDetection } from './hooks/useFaceDetection.js';
import { usePoseDetection } from './hooks/usePoseDetection.js';
import './App.css';

export default function App() {
  const [mode, setMode] = useState('live');              // 'live' | 'upload'
  const [mirrored, setMirrored] = useState(true);
  const [selectedOrnament, setSelectedOrnament] = useState(null);
  const [hasDetection, setHasDetection] = useState(false);
  const [screenshotTrigger, setScreenshotTrigger] = useState(null);
  const [flashVisible, setFlashVisible] = useState(false);

  const cameraRef = useRef(null);

  // Check if models are ready (used for loading overlay)
  const { ready: faceReady } = useFaceDetection();
  const { ready: poseReady } = usePoseDetection();
  const isLoading = !faceReady && !poseReady;

  const handleScreenshot = useCallback(() => {
    setFlashVisible(true);
    setScreenshotTrigger(Date.now());
    setTimeout(() => setFlashVisible(false), 300);
  }, []);

  const handleScreenshotReady = useCallback(() => {
    setScreenshotTrigger(null);
  }, []);

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setHasDetection(false);
  }, []);

  return (
    <>
      {isLoading && <LoadingOverlay message="Initializing AI Face Detection..." />}

      <div className="app-shell">
        {/* Sidebar */}
        <OrnamentSelector
          selectedOrnament={selectedOrnament}
          onSelect={setSelectedOrnament}
        />

        {/* Main content */}
        <div className="main-content">
          {/* Control bar */}
          <ControlBar
            mode={mode}
            onModeChange={handleModeChange}
            mirrored={mirrored}
            onMirrorToggle={() => setMirrored((m) => !m)}
            onScreenshot={handleScreenshot}
            hasDetection={hasDetection}
          />

          {/* Viewport — video + AR canvas stacked */}
          <div className="viewport">
            <CameraView
              ref={cameraRef}
              mode={mode}
              mirrored={mirrored}
            />

            <ThreeARCanvas
              videoRef={cameraRef}
              ornament={selectedOrnament}
              mirrored={mirrored}
              onDetectionChange={setHasDetection}
              screenshotTrigger={screenshotTrigger}
              onScreenshotReady={handleScreenshotReady}
            />

            {/* Product Detail Card */}
            {selectedOrnament && (
              <div className="product-card-overlay">
                <div className="product-card-header">
                  <span className="product-material">{selectedOrnament.material}</span>
                  <h4 className="product-title">{selectedOrnament.name}</h4>
                </div>
                <p className="product-description">{selectedOrnament.description}</p>
                <div className="product-card-footer">
                  <span className="product-price">${selectedOrnament.price.toLocaleString()}</span>
                  <button className="buy-now-btn">Buy Now</button>
                </div>
              </div>
            )}

            {/* Flash effect on screenshot */}
            {flashVisible && <div className="screenshot-flash" aria-hidden="true" />}

            {/* "No ornament" hint */}
            {!selectedOrnament && (
              <div className="no-selection-hint">
                <span className="hint-icon">👈</span>
                <p>Pick a jewel from the sidebar to try it on!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatAssistant onSelectOrnament={setSelectedOrnament} />
    </>
  );
}
