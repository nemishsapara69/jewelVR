import { toPixel, getHeadRoll, getEarSpan, getMidpoint } from './landmarkHelpers.js';
import { FACE_LANDMARKS, POSE_LANDMARKS } from './landmarkHelpers.js';
import { CATEGORIES } from './ornamentData.js';

// Image cache so we don't reload on every frame
const imageCache = {};

function loadImage(src) {
  if (imageCache[src]) return imageCache[src];
  const img = new Image();
  img.src = src;
  imageCache[src] = img;
  return img;
}

/**
 * Draw earrings at both ear positions with head roll rotation
 */
function drawEarrings(ctx, ornament, faceLandmarks, canvasW, canvasH) {
  const lm = faceLandmarks[0]?.landmarks?.[0] ?? faceLandmarks[0];
  if (!lm) return;

  const leftEar = lm[FACE_LANDMARKS.LEFT_EAR_TRAGION];
  const rightEar = lm[FACE_LANDMARKS.RIGHT_EAR_TRAGION];
  const leftEye = lm[FACE_LANDMARKS.LEFT_EYE_OUTER];
  const rightEye = lm[FACE_LANDMARKS.RIGHT_EYE_OUTER];

  if (!leftEar || !rightEar || !leftEye || !rightEye) return;

  const earSpan = getEarSpan(leftEar, rightEar, canvasW, canvasH);
  const roll = getHeadRoll(leftEye, rightEye, canvasW, canvasH);
  const img = loadImage(ornament.src);

  if (!img.complete || img.naturalWidth === 0) return;

  const w = earSpan * ornament.scaleX * (canvasW / 640);
  const h = w * (img.naturalHeight / img.naturalWidth) * (ornament.scaleY / ornament.scaleX);

  [leftEar, rightEar].forEach((earLm, i) => {
    const pos = toPixel(earLm, canvasW, canvasH);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(roll + (i === 0 ? 0.05 : -0.05)); // slight mirror tilt
    ctx.drawImage(img, -w * ornament.offsetX, -h * ornament.offsetY, w, h);
    ctx.restore();
  });
}

/**
 * Draw necklace at neck/shoulder midpoint
 */
function drawNecklace(ctx, ornament, poseLandmarks, canvasW, canvasH) {
  const lm = poseLandmarks[0]?.landmarks?.[0] ?? poseLandmarks[0];
  if (!lm) return;

  const leftShoulder = lm[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = lm[POSE_LANDMARKS.RIGHT_SHOULDER];

  if (!leftShoulder || !rightShoulder) return;

  const center = getMidpoint(leftShoulder, rightShoulder, canvasW, canvasH);
  const lPos = toPixel(leftShoulder, canvasW, canvasH);
  const rPos = toPixel(rightShoulder, canvasW, canvasH);
  const shoulderSpan = Math.hypot(rPos.x - lPos.x, rPos.y - lPos.y);

  const img = loadImage(ornament.src);
  if (!img.complete || img.naturalWidth === 0) return;

  const w = shoulderSpan * ornament.scaleX;
  const h = w * (img.naturalHeight / img.naturalWidth) * (ornament.scaleY / ornament.scaleX);
  const angle = Math.atan2(rPos.y - lPos.y, rPos.x - lPos.x);

  ctx.save();
  ctx.translate(center.x, center.y - shoulderSpan * 0.15);
  ctx.rotate(angle);
  ctx.drawImage(img, -w * ornament.offsetX, -h * ornament.offsetY, w, h);
  ctx.restore();
}

/**
 * Main draw function — dispatches to earring or necklace draw
 */
export function drawOrnamentOnCanvas(ctx, ornament, faceLandmarks, poseLandmarks, canvasW, canvasH) {
  if (!ctx || !ornament) return;

  ctx.clearRect(0, 0, canvasW, canvasH);

  if (ornament.category === CATEGORIES.EARRINGS) {
    if (faceLandmarks && faceLandmarks.length > 0) {
      drawEarrings(ctx, ornament, faceLandmarks, canvasW, canvasH);
    }
  } else if (ornament.category === CATEGORIES.NECKLACES) {
    if (poseLandmarks && poseLandmarks.length > 0) {
      drawNecklace(ctx, ornament, poseLandmarks, canvasW, canvasH);
    }
  }
}
