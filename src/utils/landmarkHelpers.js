/**
 * MediaPipe Face Landmark indices used by JewelVR
 * Reference: https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker
 */
export const FACE_LANDMARKS = {
  LEFT_EAR_TRAGION: 234,
  RIGHT_EAR_TRAGION: 454,
  LEFT_EYE_OUTER: 33,
  RIGHT_EYE_OUTER: 263,
  NOSE_TIP: 1,
  CHIN: 152,
  LEFT_CHEEK: 50,
  RIGHT_CHEEK: 280,
};

/**
 * MediaPipe Pose Landmark indices used for necklace positioning
 */
export const POSE_LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
};

/**
 * Convert normalized landmark to canvas pixel coordinates
 */
export function toPixel(landmark, canvasW, canvasH, mirrored = true) {
  const x = mirrored ? (1 - landmark.x) * canvasW : landmark.x * canvasW;
  const y = landmark.y * canvasH;
  return { x, y };
}

/**
 * Calculate head rotation angle (roll) from eye landmarks
 */
export function getHeadRoll(leftEye, rightEye, canvasW, canvasH) {
  const l = toPixel(leftEye, canvasW, canvasH);
  const r = toPixel(rightEye, canvasW, canvasH);
  return Math.atan2(r.y - l.y, r.x - l.x);
}

/**
 * Get ear-to-ear pixel distance (used for earring sizing)
 */
export function getEarSpan(leftEar, rightEar, canvasW, canvasH) {
  const l = toPixel(leftEar, canvasW, canvasH);
  const r = toPixel(rightEar, canvasW, canvasH);
  return Math.hypot(r.x - l.x, r.y - l.y);
}

/**
 * Get midpoint between two landmarks (for necklace center)
 */
export function getMidpoint(a, b, canvasW, canvasH) {
  const pa = toPixel(a, canvasW, canvasH);
  const pb = toPixel(b, canvasW, canvasH);
  return { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
}

/**
 * Exponential moving average smoothing to prevent jitter
 * alpha: 0 = no update, 1 = no smoothing
 */
export function smooth(prev, next, alpha = 0.4) {
  if (!prev) return { ...next };
  return {
    x: prev.x * (1 - alpha) + next.x * alpha,
    y: prev.y * (1 - alpha) + next.y * alpha,
  };
}

/**
 * Smooth a number value
 */
export function smoothValue(prev, next, alpha = 0.4) {
  if (prev === null || prev === undefined) return next;
  return prev * (1 - alpha) + next * alpha;
}
