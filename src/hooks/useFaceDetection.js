import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export function useFaceDetection() {
  const landmarkerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function initLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });

        if (!cancelled) {
          landmarkerRef.current = landmarker;
          setReady(true);
        }
      } catch (err) {
        console.warn('GPU delegate failed, falling back to CPU:', err);
        try {
          const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
          );
          const landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_URL,
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
          });
          if (!cancelled) {
            landmarkerRef.current = landmarker;
            setReady(true);
          }
        } catch (e) {
          if (!cancelled) setError(e.message);
        }
      }
    }

    initLandmarker();
    return () => { cancelled = true; };
  }, []);

  const detect = useCallback((videoEl, timestampMs) => {
    if (!landmarkerRef.current || !videoEl) return null;
    try {
      return landmarkerRef.current.detectForVideo(videoEl, timestampMs);
    } catch {
      return null;
    }
  }, []);

  const detectImage = useCallback(async (imageEl) => {
    if (!landmarkerRef.current || !imageEl) return null;
    // Switch to IMAGE mode for static photos
    try {
      await landmarkerRef.current.setOptions({ runningMode: 'IMAGE' });
      const result = landmarkerRef.current.detect(imageEl);
      await landmarkerRef.current.setOptions({ runningMode: 'VIDEO' });
      return result;
    } catch {
      return null;
    }
  }, []);

  return { ready, error, detect, detectImage };
}
