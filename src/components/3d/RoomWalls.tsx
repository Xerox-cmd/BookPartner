import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createWoodTexture, createVintageRugTexture } from '../../utils/textureGenerator';

export const RoomWalls: React.FC = () => {
  // Textures
  const floorWoodTexture = useMemo(() => {
    const tex = createWoodTexture('#4a2817', '#281409');
    tex.repeat.set(4, 4);
    return tex;
  }, []);

  const wallWoodTexture = useMemo(() => createWoodTexture('#361e10', '#1c0c05'), []);
  const rugTexture = useMemo(() => createVintageRugTexture(), []);

  // Materials
  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: floorWoodTexture,
        roughness: 0.32, // satin warm sheen
        metalness: 0.05,
        color: '#6e3c1e',
      }),
    [floorWoodTexture]
  );

  const rugMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: rugTexture,
        roughness: 0.75,
        metalness: 0.0,
        bumpScale: 0.03,
      }),
    [rugTexture]
  );

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#523626',
        roughness: 0.65,
        metalness: 0.02,
      }),
    []
  );

  const moldingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: wallWoodTexture,
        roughness: 0.38,
        color: '#462716',
      }),
    [wallWoodTexture]
  );

  const roomWidth = 9.0;
  const roomDepth = 11.0;
  const roomHeight = 6.0;

  return (
    <group>
      {/* 1. Polished Warm Wooden Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -roomHeight / 2, 0]}
        material={floorMaterial}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
      </mesh>

      {/* 2. Vintage Ornate Patterned Rug in Room Center */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -roomHeight / 2 + 0.015, 0.5]}
        material={rugMaterial}
        receiveShadow
      >
        <planeGeometry args={[4.2, 5.8]} />
      </mesh>

      {/* 3. Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, roomHeight / 2, 0]}
        material={wallMaterial}
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
      </mesh>

      {/* Ceiling Beams */}
      {[-3, -1, 1, 3].map((zPos, idx) => (
        <mesh
          key={idx}
          position={[0, roomHeight / 2 - 0.15, zPos]}
          material={moldingMaterial}
          castShadow
        >
          <boxGeometry args={[roomWidth, 0.3, 0.25]} />
        </mesh>
      ))}

      {/* 4. Back Wall (With Window Opening cutout area) */}
      <mesh position={[-3.3, 0, -roomDepth / 2]} material={wallMaterial} receiveShadow castShadow>
        <boxGeometry args={[2.5, roomHeight, 0.2]} />
      </mesh>
      <mesh position={[3.3, 0, -roomDepth / 2]} material={wallMaterial} receiveShadow castShadow>
        <boxGeometry args={[2.5, roomHeight, 0.2]} />
      </mesh>
      <mesh position={[0, roomHeight / 2 - 0.4, -roomDepth / 2]} material={wallMaterial} receiveShadow castShadow>
        <boxGeometry args={[4.1, 0.8, 0.2]} />
      </mesh>
      <mesh position={[0, -roomHeight / 2 + 0.4, -roomDepth / 2]} material={wallMaterial} receiveShadow castShadow>
        <boxGeometry args={[4.1, 0.8, 0.2]} />
      </mesh>

      {/* 5. Left & Right Walls */}
      <mesh
        position={[-roomWidth / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={wallMaterial}
        receiveShadow
      >
        <planeGeometry args={[roomDepth, roomHeight]} />
      </mesh>
      <mesh
        position={[roomWidth / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        material={wallMaterial}
        receiveShadow
      >
        <planeGeometry args={[roomDepth, roomHeight]} />
      </mesh>

      {/* 6. Baseboard Moldings around room perimeter */}
      <mesh position={[0, -roomHeight / 2 + 0.15, -roomDepth / 2 + 0.05]} material={moldingMaterial}>
        <boxGeometry args={[roomWidth, 0.3, 0.1]} />
      </mesh>
      <mesh position={[-roomWidth / 2 + 0.05, -roomHeight / 2 + 0.15, 0]} material={moldingMaterial}>
        <boxGeometry args={[0.1, 0.3, roomDepth]} />
      </mesh>
      <mesh position={[roomWidth / 2 - 0.05, -roomHeight / 2 + 0.15, 0]} material={moldingMaterial}>
        <boxGeometry args={[0.1, 0.3, roomDepth]} />
      </mesh>
    </group>
  );
};
