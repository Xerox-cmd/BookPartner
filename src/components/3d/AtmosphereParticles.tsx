import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtmosphereParticlesProps {
  count?: number;
}

export const AtmosphereParticles: React.FC<AtmosphereParticlesProps> = ({ count = 180 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions, speeds, and scales for dust motes floating in sunset light
  const [positions, speeds] = useMemo(() => {
    const posArr = new Float32Array(count * 3);
    const speedArr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Concentrate dust motes near the central window light stream (x: -2 to 2, y: -2 to 3, z: -4 to 3)
      posArr[i * 3] = (Math.random() - 0.5) * 5.0;
      posArr[i * 3 + 1] = -2.0 + Math.random() * 5.0;
      posArr[i * 3 + 2] = -4.0 + Math.random() * 7.0;

      speedArr[i * 3] = (Math.random() - 0.5) * 0.005;
      speedArr[i * 3 + 1] = 0.002 + Math.random() * 0.004; // slow upward drift
      speedArr[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return [posArr, speedArr];
  }, [count]);

  // Animate dust motes gently drifting naturally
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const timeScale = Math.min(delta, 0.1) * 60;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      arr[i * 3] += (speeds[i * 3] + Math.sin(t + i) * 0.0008) * timeScale;
      arr[i * 3 + 1] += speeds[i * 3 + 1] * timeScale;
      arr[i * 3 + 2] += speeds[i * 3 + 2] * timeScale;

      // Reset when floating out of bounds
      if (arr[i * 3 + 1] > 3.0) {
        arr[i * 3 + 1] = -2.0;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#fde047" // Golden dust motes
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
