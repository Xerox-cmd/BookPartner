import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { BookData, CameraPreset, TimeOfDay } from '../../types';
import { RoomWalls } from './RoomWalls';
import { BookShelf } from './BookShelf';
import { ArchedWindow } from './ArchedWindow';
import { CozyFurniture } from './CozyFurniture';
import { AtmosphereParticles } from './AtmosphereParticles';
import { WindowSunflowers } from './Sunflowers';

interface LibrarySceneProps {
  books: BookData[];
  onHoverBook: (book: BookData | null, e?: THREE.Event) => void;
  onClickBook: (book: BookData) => void;
  filteredBookIds?: string[];
  cameraPreset: CameraPreset;
  timeOfDay: TimeOfDay;
}

// Camera Lerp Controller Subcomponent
const CameraController: React.FC<{ preset: CameraPreset; orbitRef: React.RefObject<any> }> = ({
  preset,
  orbitRef,
}) => {
  const { camera } = useThree();

  // Target positions and lookAt targets for camera presets
  const presetConfigs: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
    overview: { pos: [0, 0.2, 5.0], target: [0, 0, 0] },
    'left-shelf': { pos: [-1.8, 0.1, 1.6], target: [-4.0, 0.1, 0] },
    'right-shelf': { pos: [1.8, 0.1, 1.6], target: [4.0, 0.1, 0] },
    'window-view': { pos: [0, -0.2, 2.2], target: [0, 0.2, -5.0] },
    'cozy-corner': { pos: [1.2, -0.8, 3.4], target: [2.4, -1.6, 2.0] },
  };

  const targetConfig = presetConfigs[preset] || presetConfigs.overview;
  const targetPosVec = useRef(new THREE.Vector3(...targetConfig.pos));
  const targetLookVec = useRef(new THREE.Vector3(...targetConfig.target));

  React.useEffect(() => {
    targetPosVec.current.set(...targetConfig.pos);
    targetLookVec.current.set(...targetConfig.target);
  }, [preset, targetConfig]);

  useFrame((_, delta) => {
    if (!orbitRef.current) return;

    // Smooth frame-rate independent exponential lerp
    const lerpFactor = 1 - Math.exp(-5.5 * delta);

    // Lerp camera position
    camera.position.lerp(targetPosVec.current, lerpFactor);

    // Lerp OrbitControls target
    orbitRef.current.target.lerp(targetLookVec.current, lerpFactor);
    orbitRef.current.update();
  });

  return null;
};

export const LibraryScene: React.FC<LibrarySceneProps> = ({
  books,
  onHoverBook,
  onClickBook,
  filteredBookIds = [],
  cameraPreset,
  timeOfDay,
}) => {
  const orbitRef = useRef<any>(null);

  return (
    <div className="w-full h-full bg-[#1e120b] relative">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 0.2, 5.0], fov: 52 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.45,
        }}
      >
        {/* Luminous Warm Ambient Lighting illuminating the entire room */}
        <ambientLight color="#fff0db" intensity={0.95} />

        {/* Golden Sunset Fill Hemisphere Light */}
        <hemisphereLight
          color="#ffaa55"
          groundColor="#5c341b"
          intensity={0.85}
        />

        {/* Soft Warm Room Fill Light */}
        <pointLight
          position={[0, 1.5, 1.0]}
          color="#ffc107"
          intensity={1.8}
          distance={10.0}
          decay={1.5}
        />

        {/* Camera Lerp Controller */}
        <CameraController preset={cameraPreset} orbitRef={orbitRef} />

        {/* Orbit Controls (constrained to cozy room bounds) */}
        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          minDistance={1.2}
          maxDistance={6.5}
          maxPolarAngle={Math.PI / 2 + 0.05} // don't go below floor
          minPolarAngle={Math.PI / 4}
          rotateSpeed={0.6}
          dampingFactor={0.05}
        />

        {/* 1. Room Structure (Floor, Rug, Ceiling, Walls) */}
        <RoomWalls />

        {/* 2. Central Arched Window with Sunset Sky & Sunset Light */}
        <ArchedWindow position={[0, 0, -5.2]} timeOfDay={timeOfDay} />
        
        {/* Sunflowers basking in window light */}
        <WindowSunflowers />

        {/* 3. Left Wall Bookshelf */}
        <BookShelf
          side="left"
          position={[-4.1, 0, 0]}
          books={books}
          onHoverBook={onHoverBook}
          onClickBook={onClickBook}
          filteredBookIds={filteredBookIds}
        />

        {/* 4. Right Wall Bookshelf */}
        <BookShelf
          side="right"
          position={[4.1, 0, 0]}
          books={books}
          onHoverBook={onHoverBook}
          onClickBook={onClickBook}
          filteredBookIds={filteredBookIds}
        />

        {/* 5. Cozy Armchair & Reading Lamp Corner */}
        <CozyFurniture />

        {/* 6. Volumetric Dust Particles in Sunset Light */}
        <AtmosphereParticles count={220} />
      </Canvas>
    </div>
  );
};
