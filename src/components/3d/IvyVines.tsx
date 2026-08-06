import React, { useMemo } from 'react';
import * as THREE from 'three';

interface IvyVinesProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  leafDensity?: number;
  hasFlowers?: boolean;
}

export const IvyVines: React.FC<IvyVinesProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  leafDensity = 50,
  hasFlowers = true,
}) => {
  // Generate multi-branching procedural vine stems, dense leaf foliage, and soft rose blooms
  const { vineTubes, leaves, roses } = useMemo(() => {
    const tubes: THREE.TubeGeometry[] = [];
    const leafData: { pos: THREE.Vector3; rot: THREE.Euler; scale: number; color: string }[] = [];
    const roseData: { pos: THREE.Vector3; rot: THREE.Euler; scale: number; color: string }[] = [];

    const leafColors = ['#1e3a1e', '#2b4c26', '#3b6233', '#193318', '#497540', '#254421'];
    const roseColors = ['#fda4af', '#f43f5e', '#fff1f2', '#fecdd3', '#fbbf24', '#e11d48'];

    // Create 3 primary creeping vine tendril paths for dense natural growth
    const branchCount = 3;
    for (let b = 0; b < branchCount; b++) {
      const points: THREE.Vector3[] = [];
      let current = new THREE.Vector3((b - 1) * 0.1, 0, (Math.random() - 0.5) * 0.1);
      points.push(current.clone());

      const segments = 14;
      for (let i = 0; i < segments; i++) {
        current.x += (Math.random() - 0.48) * 0.22;
        current.y += 0.2 + Math.random() * 0.22;
        current.z += (Math.random() - 0.5) * 0.15;
        points.push(current.clone());
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.018 - b * 0.003, 8, false);
      tubes.push(tubeGeo);

      // Generate leaves along this branch
      const branchDensity = Math.floor(leafDensity / branchCount);
      for (let i = 0; i < branchDensity; i++) {
        const u = i / branchDensity;
        const point = curve.getPoint(u);
        const tangent = curve.getTangent(u);

        // Natural outwards leaf spreading vector
        const normal = new THREE.Vector3(-tangent.y, tangent.x, (Math.random() - 0.5) * 1.5).normalize();
        const pos = point.clone().add(normal.multiplyScalar(0.04 + Math.random() * 0.1));

        const rot = new THREE.Euler(
          Math.random() * 0.8,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.8
        );

        const leafScale = 0.09 + Math.random() * 0.08;
        const color = leafColors[Math.floor(Math.random() * leafColors.length)];

        leafData.push({ pos, rot, scale: leafScale, color });

        // English Garden Rose blooms nestled in the ivy
        if (hasFlowers && Math.random() > 0.65) {
          const rosePos = pos.clone().add(new THREE.Vector3(0, 0.02, 0.03));
          const roseRot = new THREE.Euler(
            Math.random() * 0.6,
            Math.random() * Math.PI,
            Math.random() * 0.4
          );
          const roseScale = 0.06 + Math.random() * 0.05;
          const rColor = roseColors[Math.floor(Math.random() * roseColors.length)];
          roseData.push({ pos: rosePos, rot: roseRot, scale: roseScale, color: rColor });
        }
      }
    }

    return { vineTubes: tubes, leaves: leafData, roses: roseData };
  }, [leafDensity, hasFlowers]);

  // Realistic 5-lobed English Ivy leaf 3D geometry
  const leafGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.4, 0.2, -0.7, 0.6, -0.4, 0.9);
    shape.bezierCurveTo(-0.6, 1.1, -0.3, 1.4, 0, 1.5);
    shape.bezierCurveTo(0.3, 1.4, 0.6, 1.1, 0.4, 0.9);
    shape.bezierCurveTo(0.7, 0.6, 0.4, 0.2, 0, 0);
    const geo = new THREE.ShapeGeometry(shape);
    geo.center();
    return geo;
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Wooden / Bark Vine Tendril Stems */}
      {vineTubes.map((tube, idx) => (
        <mesh key={idx} geometry={tube} castShadow>
          <meshStandardMaterial color="#24150b" roughness={0.85} metalness={0.05} />
        </mesh>
      ))}

      {/* Denser Ivy Leaves */}
      {leaves.map((leaf, idx) => (
        <mesh
          key={idx}
          geometry={leafGeometry}
          position={leaf.pos}
          rotation={leaf.rot}
          scale={[leaf.scale, leaf.scale, leaf.scale]}
        >
          <meshStandardMaterial
            color={leaf.color}
            roughness={0.35}
            metalness={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Soft Layered English Garden Rose Blooms */}
      {roses.map((rose, idx) => (
        <group key={idx} position={rose.pos} rotation={rose.rot} scale={[rose.scale, rose.scale, rose.scale]}>
          {/* Outer Petal Ring */}
          <mesh>
            <sphereGeometry args={[1.0, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color={rose.color} roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
          {/* Inner Petal Bud Core */}
          <mesh position={[0, 0, 0.2]}>
            <sphereGeometry args={[0.65, 10, 10]} />
            <meshStandardMaterial color={rose.color} roughness={0.4} />
          </mesh>
          {/* Green Calyx Leaf Cup */}
          <mesh position={[0, 0, -0.2]}>
            <coneGeometry args={[0.7, 0.6, 6]} />
            <meshStandardMaterial color="#1f3d1b" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

