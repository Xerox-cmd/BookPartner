import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createSunflowerSeedTexture, createSunflowerSeedBumpMap } from '../../utils/textureGenerator';

interface SunflowerProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  stemHeight?: number;
  stemBend?: number;
}

export const Sunflower: React.FC<SunflowerProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  stemHeight = 0.6,
  stemBend = 0.1,
}) => {
  // 1. Seed Center Fibonacci Disc Textures & Material
  const seedTexture = useMemo(() => createSunflowerSeedTexture(), []);
  const seedBumpMap = useMemo(() => createSunflowerSeedBumpMap(), []);

  const seedCenterMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: seedTexture,
        bumpMap: seedBumpMap,
        bumpScale: 0.006,
        roughness: 0.72,
        metalness: 0.02,
      }),
    [seedTexture, seedBumpMap]
  );

  // 2. Light & Radiant Petal Materials (3 bright, sunlit yellow shades)
  const petalMaterials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: '#fde047', // Light Sunny Yellow
        roughness: 0.26,
        metalness: 0.01,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshStandardMaterial({
        color: '#fbbf24', // Bright Radiant Yellow
        roughness: 0.28,
        metalness: 0.01,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshStandardMaterial({
        color: '#f59e0b', // Warm Golden Amber
        roughness: 0.30,
        metalness: 0.01,
        side: THREE.DoubleSide,
      }),
    ],
    []
  );

  const stemMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4d7c0f', // Fresh Vibrant Olive-Green
        roughness: 0.5,
      }),
    []
  );

  const leafMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3f6212', // Light Warm Spring Green
        roughness: 0.45,
        side: THREE.DoubleSide,
      }),
    []
  );

  // 3. 3D Organic Curved Petal Geometry
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.065, 0.12, -0.08, 0.32, -0.015, 0.48);
    shape.bezierCurveTo(-0.005, 0.5, 0.005, 0.5, 0.015, 0.48);
    shape.bezierCurveTo(0.08, 0.32, 0.065, 0.12, 0, 0);

    const extrudeSettings = {
      steps: 1,
      depth: 0.006,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.003,
      bevelSegments: 2,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();

    // Displace vertex positions for gentle 3D leaf fold & tip curl
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // Central V-crease along the petal axis
      z -= (x * x) * 2.5;
      // Soft forward tip curl
      if (y > 0.1) {
        z += Math.sin((y - 0.1) * Math.PI) * 0.04;
      }
      posAttr.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // 4. Curved Stem Leaf Geometry with Central Fold
  const leafGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.16, 0.08, -0.22, 0.28, 0, 0.45);
    shape.bezierCurveTo(0.22, 0.28, 0.16, 0.08, 0, 0);

    const geo = new THREE.ShapeGeometry(shape);
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // Leaf longitudinal V-fold and gentle droop
      z -= Math.abs(x) * 0.25;
      z += Math.sin(y * Math.PI) * 0.06;
      posAttr.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // 5. Generate 3 Layered Rings of Ray Petals (Outer 18, Middle 18, Inner 14)
  const petalData = useMemo(() => {
    const data = [];
    
    // Outer ring (18 petals) - slightly opening outward
    const outerCount = 18;
    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
      data.push({
        rotZ: angle,
        dist: 0.135,
        scaleX: 0.8 + Math.random() * 0.15,
        scaleY: 0.95 + Math.random() * 0.15,
        tiltX: 0.18 + Math.random() * 0.08,
        matIdx: i % petalMaterials.length,
      });
    }

    // Middle ring (18 petals) - staggered
    const midCount = 18;
    for (let i = 0; i < midCount; i++) {
      const angle = ((i + 0.5) / midCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
      data.push({
        rotZ: angle,
        dist: 0.118,
        scaleX: 0.72 + Math.random() * 0.12,
        scaleY: 0.85 + Math.random() * 0.12,
        tiltX: 0.28 + Math.random() * 0.08,
        matIdx: (i + 1) % petalMaterials.length,
      });
    }

    // Inner rim ring (14 petals) - hugging seed disk
    const innerCount = 14;
    for (let i = 0; i < innerCount; i++) {
      const angle = ((i + 0.25) / innerCount) * Math.PI * 2;
      data.push({
        rotZ: angle,
        dist: 0.102,
        scaleX: 0.62 + Math.random() * 0.1,
        scaleY: 0.72 + Math.random() * 0.1,
        tiltX: 0.38 + Math.random() * 0.08,
        matIdx: (i + 2) % petalMaterials.length,
      });
    }

    return data;
  }, [petalMaterials]);

  // Stem curve
  const stemCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(stemBend * 0.5, stemHeight * 0.5, stemBend * 0.2),
      new THREE.Vector3(stemBend, stemHeight, stemBend * 0.5),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, [stemHeight, stemBend]);

  const stemGeo = useMemo(() => {
    return new THREE.TubeGeometry(stemCurve, 16, 0.016, 10, false);
  }, [stemCurve]);

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Organic Curved Stem */}
      <mesh geometry={stemGeo} material={stemMaterial} castShadow />

      {/* Stem Leaves */}
      <mesh
        geometry={leafGeometry}
        material={leafMaterial}
        position={[stemBend * 0.3, stemHeight * 0.35, stemBend * 0.1]}
        rotation={[0.4, 0.8, -0.3]}
        scale={[0.85, 0.85, 0.85]}
        castShadow
      />
      <mesh
        geometry={leafGeometry}
        material={leafMaterial}
        position={[stemBend * 0.65, stemHeight * 0.68, stemBend * 0.32]}
        rotation={[0.3, -1.0, 0.4]}
        scale={[0.75, 0.75, 0.75]}
        castShadow
      />

      {/* Flower Head Group at stem tip */}
      <group position={[stemBend, stemHeight, stemBend * 0.5]} rotation={[0.38, 0, 0]}>
        {/* Fibonacci Seed Center Disc */}
        <mesh material={seedCenterMaterial} position={[0, 0, 0.012]} castShadow receiveShadow>
          <cylinderGeometry args={[0.108, 0.102, 0.024, 32]} />
        </mesh>

        {/* Backing Green Calyx Sepals (Involucre Bracts) */}
        <mesh position={[0, 0, -0.015]} material={leafMaterial}>
          <coneGeometry args={[0.13, 0.045, 20]} />
        </mesh>

        {/* 3D Petal Rings */}
        {petalData.map((p, idx) => (
          <group key={idx} rotation={[0, 0, p.rotZ]}>
            <mesh
              geometry={petalGeometry}
              material={petalMaterials[p.matIdx]}
              position={[0, p.dist, 0]}
              rotation={[p.tiltX, 0, 0]}
              scale={[p.scaleX, p.scaleY, 1]}
            />
          </group>
        ))}
      </group>
    </group>
  );
};

{/* --- SUNFLOWER VASE BOUQUET --- */}
export const SunflowerVase: React.FC<{ position?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
}) => {
  const vaseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fdfbf7', // Warm Creamy Glazed Ceramic
        roughness: 0.18,
        metalness: 0.08,
      }),
    []
  );

  const goldAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d97706', // Warm Antique Brass / Gold Rim
        roughness: 0.25,
        metalness: 0.85,
      }),
    []
  );

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Glazed Ceramic Vase */}
      <mesh position={[0, 0.22, 0]} material={vaseMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.14, 0.44, 28]} />
      </mesh>
      {/* Gold Trim Rim */}
      <mesh position={[0, 0.44, 0]} material={goldAccentMaterial} castShadow>
        <torusGeometry args={[0.082, 0.012, 12, 28]} />
      </mesh>
      {/* Gold Base Trim */}
      <mesh position={[0, 0.01, 0]} material={goldAccentMaterial} castShadow>
        <torusGeometry args={[0.138, 0.01, 12, 28]} />
      </mesh>

      {/* Bouquet of Sunflowers gracefully fanned out */}
      <Sunflower position={[0, 0.35, 0]} stemHeight={0.48} stemBend={0.06} scale={0.85} rotation={[0.1, 0.2, 0]} />
      <Sunflower position={[-0.04, 0.35, 0.02]} stemHeight={0.52} stemBend={-0.12} scale={0.9} rotation={[0.2, -0.8, -0.2]} />
      <Sunflower position={[0.05, 0.35, -0.03]} stemHeight={0.45} stemBend={0.14} scale={0.8} rotation={[-0.2, 1.1, 0.15]} />
      <Sunflower position={[0.02, 0.35, 0.05]} stemHeight={0.55} stemBend={0.02} scale={0.95} rotation={[0.3, 0.4, 0.1]} />
    </group>
  );
};

{/* --- WINDOW SILL SUNFLOWERS & DECORATIONS --- */}
export const WindowSunflowers: React.FC = () => {
  return (
    <group position={[-1.75, 0.1, -1.8]}>
      {/* Sunflower vase sitting on the arched window sill */}
      <SunflowerVase position={[0.15, -0.2, 0.2]} scale={0.85} />

      {/* Natural Sunflowers leaning towards the window sunlight */}
      <Sunflower position={[-0.2, -0.2, 0.15]} stemHeight={0.5} stemBend={-0.1} scale={0.8} rotation={[0.1, 0.5, -0.2]} />
      <Sunflower position={[0.35, -0.2, 0.22]} stemHeight={0.6} stemBend={0.15} scale={0.9} rotation={[0.2, -0.4, 0.1]} />
    </group>
  );
};

