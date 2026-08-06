import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createWoodTexture } from '../../utils/textureGenerator';
import { SunflowerVase } from './Sunflowers';

export const CozyFurniture: React.FC = () => {
  const woodTexture = useMemo(() => createWoodTexture('#361e10', '#180b04'), []);

  const woodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        roughness: 0.35,
        color: '#422413',
      }),
    [woodTexture]
  );

  const leatherMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4a2511', // Vintage warm Cognac leather
        roughness: 0.5,
        metalness: 0.1,
      }),
    []
  );

  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.25,
        metalness: 0.85,
      }),
    []
  );

  return (
    <group position={[2.4, -2.1, 2.0]} rotation={[0, -Math.PI / 4, 0]}>
      {/* --- VINTAGE LEATHER ARMCHAIR --- */}
      {/* Seat Cushion */}
      <mesh position={[0, 0.4, 0]} material={leatherMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.25, 1.1]} />
      </mesh>
      {/* Chair Backrest */}
      <mesh position={[0, 1.0, -0.45]} material={leatherMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.0, 0.25]} />
      </mesh>

      {/* Armrests */}
      {[-0.55, 0.55].map((xPos, idx) => (
        <mesh key={idx} position={[xPos, 0.7, 0]} material={leatherMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.5, 1.1]} />
        </mesh>
      ))}

      {/* Wooden Chair Legs */}
      {[
        [-0.5, 0.1, 0.45],
        [0.5, 0.1, 0.45],
        [-0.5, 0.1, -0.45],
        [0.5, 0.1, -0.45],
      ].map((legPos, idx) => (
        <mesh key={idx} position={legPos as [number, number, number]} material={woodMaterial} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.3, 12]} />
        </mesh>
      ))}

      {/* --- SIDE READING TABLE --- */}
      <group position={[-1.1, 0, 0.2]}>
        {/* Tabletop */}
        <mesh position={[0, 0.75, 0]} material={woodMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.06, 24]} />
        </mesh>
        {/* Central Table Column & Base */}
        <mesh position={[0, 0.38, 0]} material={woodMaterial} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.7, 16]} />
        </mesh>
        <mesh position={[0, 0.04, 0]} material={woodMaterial} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 0.08, 24]} />
        </mesh>

        {/* --- BRASS READING LAMP --- */}
        <group position={[0.15, 0.78, 0]}>
          {/* Base */}
          <mesh material={brassMaterial}>
            <cylinderGeometry args={[0.08, 0.1, 0.03, 16]} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 0.2, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.38, 12]} />
          </mesh>
          {/* Shade */}
          <mesh position={[0, 0.38, 0]} material={brassMaterial} castShadow>
            <coneGeometry args={[0.14, 0.16, 16, 1, true]} />
          </mesh>
          {/* Warm Glowing Bulb */}
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#ffeedd" />
          </mesh>
          {/* Intimate Warm Point Light */}
          <pointLight
            color="#ffaa44"
            intensity={2.2}
            distance={5.5}
            decay={2}
            castShadow
            shadow-bias={-0.001}
          />
        </group>

        {/* --- STEAMING TEA CUP --- */}
        <group position={[-0.15, 0.81, 0.1]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.035, 0.08, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          {/* Tea surface */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.048, 0.048, 0.005, 16]} />
            <meshStandardMaterial color="#78350f" roughness={0.1} />
          </mesh>
        </group>

        {/* --- SUNFLOWER VASE ON SIDE TABLE --- */}
        <SunflowerVase position={[-0.2, 0.77, -0.05]} scale={0.55} />

        {/* --- OPEN READING BOOK ON TABLE --- */}
        <group position={[0, 0.79, -0.15]} rotation={[0, 0.3, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.35, 0.02, 0.25]} />
            <meshStandardMaterial color="#f4eedd" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* --- LARGE SUNFLOWER VASE ON THE FLOOR BY THE ARMCHAIR --- */}
      <SunflowerVase position={[0.75, 0, 0.3]} scale={1.1} />
    </group>
  );
};
