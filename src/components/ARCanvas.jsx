import React, { useRef, useEffect, useCallback } from 'react';
import { useFaceDetection } from '../hooks/useFaceDetection.js';
import { usePoseDetection } from '../hooks/usePoseDetection.js';
import { drawOrnamentOnCanvas } from '../utils/drawOrnament.js';
import { CATEGORIES } from '../utils/ornamentData.js';
import './ARCanvas.css';

export default function ARCanvas({
  videoRef,
  ornament,
  mirrored,
  onDetectionChange,
  screenshotTrigger,
  onScreenshotReady,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const faceLandmarksRef = useRef(null);
  const poseLandmarksRef = useRef(null);
  const detectedRef = useRef(false);

  const { ready: faceReady, detect: detectFace } = useFaceDetection();
  const { ready: poseReady, detect: detectPose } = usePoseDetection();

  // Determine which model we need based on ornament category
  const needsFace = !ornament || ornament.category === CATEGORIES.EARRINGS;
  const needsPose = ornament?.category === CATEGORIES.NECKLACES;
  const isReady = needsFace ? faceReady : (needsPose ? poseReady : faceReady);

  const drawLoop = useCallback((timestamp) => {
    const videoEl = videoRef?.current?.getVideoEl?.() ?? videoRef?.current;
    const canvas = canvasRef.current;
    if (!canvas || !videoEl) {
      rafRef.current = requestAnimationFrame(drawLoop);
      return;
    }

    // Sync canvas size to video
    if (videoEl.videoWidth > 0) {
      if (canvas.width !== videoEl.videoWidth)  canvas.width  = videoEl.videoWidth;
      if (canvas.height !== videoEl.videoHeight) canvas.height = videoEl.videoHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!ornament) {
      rafRef.current = requestAnimationFrame(drawLoop);
      return;
    }

    // Throttle detection to max ~30fps
    if (timestamp - lastTimestampRef.current >= 33 && videoEl.readyState >= 2) {
      lastTimestampRef.current = timestamp;
      const tsMs = performance.now();

      if (needsFace && faceReady) {
        const result = detectFace(videoEl, tsMs);
        if (result?.landmarks?.length > 0) {
          faceLandmarksRef.current = result.landmarks.map((lm) => ({ landmarks: [lm] }));
          if (!detectedRef.current) { detectedRef.current = true; onDetectionChange?.(true); }
        } else {
          faceLandmarksRef.current = null;
          if (detectedRef.current) { detectedRef.current = false; onDetectionChange?.(false); }
        }
      }

      if (needsPose && poseReady) {
        const result = detectPose(videoEl, tsMs);
        if (result?.landmarks?.length > 0) {
          poseLandmarksRef.current = result.landmarks.map((lm) => ({ landmarks: [lm] }));
          if (!detectedRef.current) { detectedRef.current = true; onDetectionChange?.(true); }
        } else {
          poseLandmarksRef.current = null;
          if (detectedRef.current) { detectedRef.current = false; onDetectionChange?.(false); }
        }
      }
    }

    // Draw ornament overlay
    if (canvas.width > 0) {
      drawOrnamentOnCanvas(
        ctx,
        ornament,
        faceLandmarksRef.current,
        poseLandmarksRef.current,
        canvas.width,
        canvas.height
      );
    }

    rafRef.current = requestAnimationFrame(drawLoop);
  }, [ornament, faceReady, poseReady, detectFace, detectPose, needsFace, needsPose, videoRef, onDetectionChange]);

  // Start/stop render loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawLoop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [drawLoop]);

  // Handle screenshot trigger
  useEffect(() => {
    if (!screenshotTrigger) return;

    const videoEl = videoRef?.current?.getVideoEl?.() ?? videoRef?.current;
    const canvas = canvasRef.current;
    if (!canvas || !videoEl) return;

    // Composite video + overlay onto a new canvas for download
    const composite = document.createElement('canvas');
    composite.width = canvas.width || videoEl.videoWidth || 1280;
    composite.height = canvas.height || videoEl.videoHeight || 720;
    const cctx = composite.getContext('2d');

    // Mirror if needed
    if (mirrored) {
      cctx.save();
      cctx.translate(composite.width, 0);
      cctx.scale(-1, 1);
    }
    try { cctx.drawImage(videoEl, 0, 0, composite.width, composite.height); } catch {}
    if (mirrored) cctx.restore();

    cctx.drawImage(canvas, 0, 0);

    composite.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `JewelVR_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      onScreenshotReady?.();
    }, 'image/png');
  }, [screenshotTrigger, mirrored, videoRef, onScreenshotReady]);

  return (
    <canvas
      ref={canvasRef}
      id="ar-canvas"
      className={`ar-canvas ${!isReady ? 'loading' : ''}`}
      aria-label="AR jewelry overlay canvas"
    />
  );
}
