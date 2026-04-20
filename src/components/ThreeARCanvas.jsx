import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Environment, PerspectiveCamera, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useFaceDetection } from '../hooks/useFaceDetection.js';
import { usePoseDetection } from '../hooks/usePoseDetection.js';

// Landmark IDs
const EAR_L = 234;
const EAR_R = 454;
const SHOULDER_L = 11;
const SHOULDER_R = 12;

// --- Background Removal Helper ---
const getProcessedTexture = (url) => {
  // In a real app, we'd use a WASM background remover here.
  // For now, we use a standard loader.
  return url;
};

function OrnamentPiece({ ornament, position, rotation, scale, side }) {
  const texture = useTexture(ornament.src);
  const meshRef = useRef();
  
  // Create a "Shine" effect that moves with the face
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Subtle wobbling for realism
    meshRef.current.position.y += Math.sin(time * 2) * 0.001;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          alphaTest={0.05}
          metalness={1.0} 
          roughness={0.15}
          emissive={new THREE.Color('#d4af37')}
          emissiveIntensity={0.2}
          envMapIntensity={2}
        />
        {/* Glow sub-mesh for "Shine" */}
        <mesh scale={[1.1, 1.1, 1]}>
           <planeGeometry args={[1, 1]} />
           <meshBasicMaterial map={texture} transparent opacity={0.1} blending={THREE.AdditiveBlending} />
        </mesh>
      </mesh>
    </Float>
  );
}

function Scene({ videoRef, ornament, mirrored, onDetectionChange }) {
  const { results: faceResults } = useFaceDetection(videoRef);
  const { results: poseResults } = usePoseDetection(videoRef);
  const { viewport } = useThree();
  const lightRef = useRef();

  const faceLandmarks = faceResults?.faceLandmarks?.[0];
  const poseLandmarks = poseResults?.landmarks?.[0];

  useFrame((state) => {
    onDetectionChange(!!(faceLandmarks || poseLandmarks));
    
    // Move lights based on face to create dynamic highlights
    if (faceLandmarks && lightRef.current) {
        const nose = faceLandmarks[1]; // Nose tip
        lightRef.current.position.set(
            (nose.x - 0.5) * viewport.width * 5,
            (0.5 - nose.y) * viewport.height * 5,
            5
        );
    }
  });

  const pieces = useMemo(() => {
    if (!ornament) return [];
    const list = [];

    if (ornament.category === 'earrings' && faceLandmarks) {
      const lEar = faceLandmarks[EAR_L];
      const rEar = faceLandmarks[EAR_R];
      const eyeL = faceLandmarks[33];
      const eyeR = faceLandmarks[263];
      
      // Calculate head rotation (Roll)
      const roll = Math.atan2(eyeR.y - eyeL.y, eyeR.x - eyeL.x);
      const dist = Math.sqrt(Math.pow(lEar.x - rEar.x, 2) + Math.pow(lEar.y - rEar.y, 2));
      
      const getPos = (lm) => [
        (lm.x - 0.5) * viewport.width * (mirrored ? -1 : 1),
        (0.5 - lm.y) * viewport.height,
        -lm.z * 10
      ];

      const s = [dist * viewport.width * ornament.scaleX * 8, dist * viewport.width * ornament.scaleY * 8, 1];

      list.push({ id: 'l', pos: getPos(lEar), rot: [0, 0, roll], scale: s });
      list.push({ id: 'r', pos: getPos(rEar), rot: [0, 0, roll], scale: s });
    }

    if (ornament.category === 'necklaces' && poseLandmarks) {
      const lSh = poseLandmarks[SHOULDER_L];
      const rSh = poseLandmarks[SHOULDER_R];
      const dist = Math.sqrt(Math.pow(lSh.x - rSh.x, 2) + Math.pow(lSh.y - rSh.y, 2));
      const midX = (lSh.x + rSh.x) / 2;
      const midY = (lSh.y + rSh.y) / 2;

      list.push({
        id: 'neck',
        pos: [(midX - 0.5) * viewport.width * (mirrored ? -1 : 1), (0.5 - midY) * viewport.height, -0.5],
        scale: [dist * viewport.width * ornament.scaleX * 1.5, dist * viewport.width * ornament.scaleY * 1.5, 1],
        rot: [0, 0, 0]
      });
    }

    return list;
  }, [ornament, faceLandmarks, poseLandmarks, viewport, mirrored]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight ref={lightRef} intensity={2} color="#fff" />
      <directionalLight position={[0, 5, 5]} intensity={1} color="#ffd700" />
      
      {pieces.map(p => (
        <OrnamentPiece 
          key={p.id}
          ornament={ornament}
          position={p.pos}
          rotation={p.rot}
          scale={p.scale}
        />
      ))}

      <Environment preset="studio" />
      
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}

export default function ThreeARCanvas({ videoRef, ornament, mirrored, onDetectionChange }) {
  const [size, setSize] = useState({ width: 0, height: 0, top: 0, left: 0 });

  useEffect(() => {
    const video = videoRef.current?.getVideoEl();
    if (!video) return;

    const updateSize = () => {
      const rect = video.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
        top: video.offsetTop,
        left: video.offsetLeft
      });
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(video);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [videoRef]);

  if (size.width === 0) return null;

  return (
    <div className="canvas-container" style={{ 
      position: 'absolute', 
      top: size.top, 
      left: size.left, 
      width: size.width, 
      height: size.height, 
      zIndex: 10, 
      pointerEvents: 'none' 
    }}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <React.Suspense fallback={null}>
          <Scene 
            videoRef={videoRef} 
            ornament={ornament} 
            mirrored={mirrored} 
            onDetectionChange={onDetectionChange} 
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
