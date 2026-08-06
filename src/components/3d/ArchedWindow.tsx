import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createSunsetSkyTexture, createWoodTexture, createWoodBumpMap, createDedicatedInscriptionTexture } from '../../utils/textureGenerator';
import { IvyVines } from './IvyVines';
import { SleepingCat } from './SleepingCat';
import { TimeOfDay } from '../../types';

interface ArchedWindowProps {
  position: [number, number, number];
  timeOfDay?: TimeOfDay;
}

export const ArchedWindow: React.FC<ArchedWindowProps> = ({
  position,
  timeOfDay = 'sunset',
}) => {
  // Rich wood textures & bump map for classical window frame
  const woodTexture = useMemo(() => createWoodTexture('#381f10', '#1c0e06'), []);
  const woodBumpMap = useMemo(() => createWoodBumpMap(), []);
  const skyTexture = useMemo(() => createSunsetSkyTexture(), []);
  const inscriptionTexture = useMemo(() => createDedicatedInscriptionTexture(), []);

  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        bumpMap: woodBumpMap,
        bumpScale: 0.008,
        roughness: 0.35,
        metalness: 0.08,
        color: '#4d2814',
      }),
    [woodTexture, woodBumpMap]
  );

  const darkJambMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: woodTexture,
        bumpMap: woodBumpMap,
        bumpScale: 0.01,
        roughness: 0.45,
        color: '#381e0e',
      }),
    [woodTexture, woodBumpMap]
  );

  // Time of Day sky backdrop settings
  const skyColors = useMemo(() => {
    switch (timeOfDay) {
      case 'twilight':
        return { skyColor: '#2e2a72', lightColor: '#93c5fd', intensity: 1.8, sunColor: '#bfdbfe' };
      case 'candlelight':
        return { skyColor: '#1c1008', lightColor: '#fb923c', intensity: 1.4, sunColor: '#fed7aa' };
      case 'golden-morning':
        return { skyColor: '#fffbeb', lightColor: '#fef08a', intensity: 3.5, sunColor: '#ffffff' };
      case 'sunset':
      default:
        return { skyColor: '#f97316', lightColor: '#ffa843', intensity: 3.2, sunColor: '#fff3d6' };
    }
  }, [timeOfDay]);

  // Window frame dimensions
  const width = 3.6;
  const height = 5.2;
  const radius = width / 2;

  // Fanlight radial spokes for upper arch tracery
  const fanlightSpokes = useMemo(() => {
    const spokes = [];
    const count = 7;
    for (let i = 1; i < count; i++) {
      const angle = (i * Math.PI) / count;
      spokes.push(angle);
    }
    return spokes;
  }, []);

  return (
    <group position={position}>
      {/* 1. Exterior Sky Backdrop Plane */}
      <mesh position={[0, 0, -1.4]}>
        <planeGeometry args={[14, 11]} />
        <meshBasicMaterial map={skyTexture} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Distant Soft Glowing Sun */}
      <mesh position={[0.7, 0.2, -1.3]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshBasicMaterial color={skyColors.sunColor} />
      </mesh>

      {/* 3. Soft Natural Warm Window Directional Sunlight */}
      <directionalLight
        color={skyColors.lightColor}
        intensity={skyColors.intensity * 1.3}
        position={[2.0, 3.5, -0.4]}
        target-position={[0, -1.2, 4.0]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0003}
      />

      {/* Soft Window Sill Ambient Bounce Light */}
      <pointLight
        position={[0.4, -height / 2 + 0.3, 0.5]}
        color={skyColors.lightColor}
        intensity={2.8}
        distance={6.0}
        decay={1.8}
      />

      {/* 4. Deep Recessed Architectural Wall Niche Jambs */}
      {/* Left Wall Jamb */}
      <mesh position={[-width / 2 - 0.2, 0, -0.2]} material={darkJambMaterial} receiveShadow castShadow>
        <boxGeometry args={[0.3, height, 0.6]} />
      </mesh>
      {/* Right Wall Jamb */}
      <mesh position={[width / 2 + 0.2, 0, -0.2]} material={darkJambMaterial} receiveShadow castShadow>
        <boxGeometry args={[0.3, height, 0.6]} />
      </mesh>
      {/* Deep Carved Deep Window Sill */}
      <mesh position={[0, -height / 2 - 0.05, 0.15]} material={frameMaterial} castShadow receiveShadow>
        <boxGeometry args={[width + 0.9, 0.26, 0.7]} />
      </mesh>

      {/* 5. Translucent Lead-Glass Pane */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width - 0.1, height - 0.1]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.88}
          opacity={0.25}
          transparent
          roughness={0.06}
          ior={1.5}
          thickness={0.15}
          reflectivity={0.65}
        />
      </mesh>

      {/* 6. Main Timber Window Frame Pillars */}
      <mesh position={[-width / 2, 0, 0]} material={frameMaterial} castShadow>
        <boxGeometry args={[0.16, height, 0.22]} />
      </mesh>
      <mesh position={[width / 2, 0, 0]} material={frameMaterial} castShadow>
        <boxGeometry args={[0.16, height, 0.22]} />
      </mesh>

      {/* Semi-Circular Top Arch Ring Frame */}
      <mesh position={[0, height / 2 - radius, 0]} material={frameMaterial} castShadow>
        <torusGeometry args={[radius, 0.08, 16, 32, Math.PI]} />
      </mesh>
      <mesh position={[0, height / 2 - radius + 0.1, 0]} material={frameMaterial} castShadow>
        <torusGeometry args={[radius - 0.1, 0.06, 16, 32, Math.PI]} />
      </mesh>

      {/* 7. Fanlight Radial Tracery Mullions at Top Arch */}
      {fanlightSpokes.map((angle, idx) => (
        <mesh
          key={idx}
          position={[0, height / 2 - radius, 0.01]}
          rotation={[0, 0, angle]}
          material={frameMaterial}
        >
          <boxGeometry args={[0.04, radius - 0.12, 0.08]} />
        </mesh>
      ))}
      <mesh position={[0, height / 2 - radius, 0.02]} material={frameMaterial}>
        <cylinderGeometry args={[0.22, 0.22, 0.1, 24]} />
      </mesh>

      {/* 8. Vertical & Horizontal Multi-Pane Glazing Bars */}
      {/* Center Vertical Mullion */}
      <mesh position={[0, -0.2, 0]} material={frameMaterial}>
        <boxGeometry args={[0.08, height - radius - 0.2, 0.14]} />
      </mesh>
      {/* Left Vertical Bar */}
      <mesh position={[-width / 4, -0.4, 0]} material={frameMaterial}>
        <boxGeometry args={[0.05, height - radius - 0.6, 0.1]} />
      </mesh>
      {/* Right Vertical Bar */}
      <mesh position={[width / 4, -0.4, 0]} material={frameMaterial}>
        <boxGeometry args={[0.05, height - radius - 0.6, 0.1]} />
      </mesh>

      {/* Horizontal Transom Bars */}
      <mesh position={[0, height / 2 - radius, 0]} material={frameMaterial}>
        <boxGeometry args={[width, 0.1, 0.16]} />
      </mesh>
      <mesh position={[0, -0.4, 0]} material={frameMaterial}>
        <boxGeometry args={[width - 0.1, 0.06, 0.1]} />
      </mesh>
      <mesh position={[0, -1.5, 0]} material={frameMaterial}>
        <boxGeometry args={[width - 0.1, 0.06, 0.1]} />
      </mesh>

      {/* Sleeping Black Library Cat resting peacefully in warm window sill */}
      <SleepingCat
        position={[0.55, -height / 2 + 0.11, 0.28]}
        rotation={[0, -Math.PI / 8, 0]}
        scale={1.75}
      />

      {/* 9. Soft Volumetric God Rays Light Beam */}
      <mesh position={[0, 0.3, 2.2]} rotation={[Math.PI / 4.2, 0, 0]}>
        <coneGeometry args={[3.6, 6.8, 32, 1, true]} />
        <meshBasicMaterial
          color={skyColors.lightColor}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 10. Climbing Ivy Vines & Flowering Roses framing window */}
      <IvyVines position={[-width / 2 - 0.2, -height / 2, 0.2]} leafDensity={55} scale={[1.3, 1.5, 1.3]} />
      <IvyVines position={[width / 2 + 0.2, -height / 2, 0.2]} leafDensity={50} scale={[1.2, 1.4, 1.2]} />
      <IvyVines
        position={[0, height / 2 - 0.2, 0.2]}
        rotation={[0, 0, Math.PI / 2]}
        leafDensity={45}
        scale={[1.1, 1.1, 1.1]}
      />
    </group>
  );
};

