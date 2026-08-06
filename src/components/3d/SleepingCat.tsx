import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SleepingCatProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const SleepingCat: React.FC<SleepingCatProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
}) => {
  const catBodyRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Sleek black coat material with gentle sheen to catch window sunlight
  const furMaterial = new THREE.MeshStandardMaterial({
    color: '#121215', // Deep midnight black coat
    roughness: 0.5,
    metalness: 0.15,
  });

  const bellyFurMaterial = new THREE.MeshStandardMaterial({
    color: '#27272a', // Soft charcoal belly & paws
    roughness: 0.6,
    metalness: 0.05,
  });

  const noseMaterial = new THREE.MeshStandardMaterial({
    color: '#fb7185', // Soft rose pink nose
    roughness: 0.3,
  });

  const innerEarMaterial = new THREE.MeshStandardMaterial({
    color: '#3f3f46', // Soft slate inner ear accent
    roughness: 0.7,
  });

  // Soft golden-tinted sleeping eye lines for contrast on black fur
  const eyeLineMaterial = new THREE.MeshBasicMaterial({
    color: '#fbbf24', // Warm golden sleeping eyelid curve
  });

  // Breathing animation & tail twitch
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Gentle sleeping breath expansion
    if (catBodyRef.current) {
      const breath = Math.sin(t * 1.8) * 0.025;
      catBodyRef.current.scale.set(1 + breath, 1 + breath * 1.2, 1 + breath);
    }

    // Occasional subtle tail twitch
    if (tailRef.current) {
      const tailTwitch = Math.sin(t * 0.8) * 0.08 + (hovered ? Math.sin(t * 6) * 0.15 : 0);
      tailRef.current.rotation.z = tailTwitch;
    }
  });

  return (
    <group
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Cat Group */}
      <group ref={catBodyRef}>
        {/* Curled Main Body Torso */}
        <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 6, 0, 0]} castShadow receiveShadow material={furMaterial}>
          <capsuleGeometry args={[0.18, 0.32, 16, 16]} />
        </mesh>

        {/* Soft Charcoal Belly Accent */}
        <mesh position={[0.02, 0.11, 0.08]} rotation={[Math.PI / 6, 0, 0]} material={bellyFurMaterial}>
          <capsuleGeometry args={[0.12, 0.28, 12, 12]} />
        </mesh>

        {/* Head Tucked Snug against Body */}
        <group position={[0.18, 0.16, 0.14]} rotation={[0.2, 0.4, -0.2]}>
          {/* Main Head Sphere */}
          <mesh castShadow receiveShadow material={furMaterial}>
            <sphereGeometry args={[0.14, 24, 24]} />
          </mesh>

          {/* Snout Muzzle */}
          <mesh position={[0, -0.02, 0.1]} material={bellyFurMaterial}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>

          {/* Pink Nose */}
          <mesh position={[0, 0.01, 0.16]} material={noseMaterial}>
            <coneGeometry args={[0.02, 0.02, 3]} />
          </mesh>

          {/* Closed Sleeping Eyes (Golden Arcs for contrast on black fur) */}
          {[-0.045, 0.045].map((x, idx) => (
            <mesh key={idx} position={[x, 0.03, 0.125]} rotation={[0, 0, idx === 0 ? -0.3 : 0.3]} material={eyeLineMaterial}>
              <torusGeometry args={[0.025, 0.005, 8, 12, Math.PI]} />
            </mesh>
          ))}

          {/* Left Ear */}
          <mesh position={[-0.08, 0.12, 0.02]} rotation={[0.2, -0.2, 0.3]} castShadow material={furMaterial}>
            <coneGeometry args={[0.045, 0.1, 16]} />
          </mesh>
          <mesh position={[-0.08, 0.12, 0.03]} rotation={[0.2, -0.2, 0.3]} material={innerEarMaterial}>
            <coneGeometry args={[0.03, 0.08, 16]} />
          </mesh>

          {/* Right Ear */}
          <mesh position={[0.08, 0.12, 0.02]} rotation={[0.2, 0.2, -0.3]} castShadow material={furMaterial}>
            <coneGeometry args={[0.045, 0.1, 16]} />
          </mesh>
          <mesh position={[0.08, 0.12, 0.03]} rotation={[0.2, 0.2, -0.3]} material={innerEarMaterial}>
            <coneGeometry args={[0.03, 0.08, 16]} />
          </mesh>
        </group>

        {/* Paws Tucked Under */}
        <mesh position={[0.22, 0.05, 0.04]} material={bellyFurMaterial} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>
        <mesh position={[-0.14, 0.05, -0.1]} material={bellyFurMaterial} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>

        {/* Curled Tail Wrapped Around Body */}
        <mesh
          ref={tailRef}
          position={[-0.18, 0.08, -0.05]}
          rotation={[Math.PI / 2, 0.3, -Math.PI / 4]}
          castShadow
          material={furMaterial}
        >
          <torusGeometry args={[0.22, 0.035, 12, 24, Math.PI * 1.2]} />
        </mesh>
      </group>

      {/* Soft Contact Shadow Ring underneath cat on the window sill */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.6]} />
        <meshBasicMaterial
          color="#100501"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* Floating Purr / Tooltip indicator when hovered */}
      {hovered && (
        <group position={[0, 0.45, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.9, 0.28]} />
            <meshBasicMaterial color="#3f1d0b" transparent opacity={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
};
