import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BookData } from '../../types';
import {
  createBookSpineTexture,
  createBookCoverTexture,
  createBookPagesTexture,
} from '../../utils/textureGenerator';

interface Book3DProps {
  book: BookData;
  position: [number, number, number];
  onHover: (book: BookData | null, e?: THREE.Event) => void;
  onClick: (book: BookData) => void;
  isFilteredOut?: boolean;
}

export const Book3D: React.FC<Book3DProps> = ({
  book,
  position,
  onHover,
  onClick,
  isFilteredOut = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Generate unique procedural textures for cover, spine, and pages
  const textures = useMemo(() => {
    const spine = createBookSpineTexture(book);
    const cover = createBookCoverTexture(book);
    const pages = createBookPagesTexture();
    return { spine, cover, pages };
  }, [book]);

  // Construct multi-material array for 6 sides of 3D box geometry:
  // [0: right (pages), 1: left (spine), 2: top (pages), 3: bottom (pages), 4: front (cover), 5: back (cover)]
  const materials = useMemo(() => {
    const isRightShelf = book.shelfPosition.side === 'right';

    // Spine material (facing outwards towards room center)
    const spineMat = new THREE.MeshStandardMaterial({
      map: textures.spine,
      roughness: 0.35,
      metalness: 0.25,
    });

    // Front/Back Cover material
    const coverMat = new THREE.MeshStandardMaterial({
      map: textures.cover,
      roughness: 0.4,
      metalness: 0.2,
    });

    // Pages edge material
    const pagesMat = new THREE.MeshStandardMaterial({
      map: textures.pages,
      roughness: 0.8,
      metalness: 0.0,
      color: '#f4eedd',
    });

    // Dark interior/back cover
    const backMat = new THREE.MeshStandardMaterial({
      color: book.primaryColor,
      roughness: 0.5,
    });

    if (isRightShelf) {
      // Right bookshelf: spine is facing left (-X direction)
      return [
        pagesMat,   // +X (pages back against wall/depth)
        spineMat,   // -X (spine facing room center!)
        pagesMat,   // +Y
        pagesMat,   // -Y
        coverMat,   // +Z
        backMat,    // -Z
      ];
    } else {
      // Left bookshelf: spine is facing right (+X direction)
      return [
        spineMat,   // +X (spine facing room center!)
        pagesMat,   // -X (pages back against wall)
        pagesMat,   // +Y
        pagesMat,   // -Y
        coverMat,   // +Z
        backMat,    // -Z
      ];
    }
  }, [book, textures]);

  // Base position target
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);

  // Calculate target offset when hovered
  const targetPos = useMemo(() => {
    const isRightShelf = book.shelfPosition.side === 'right';
    const vec = basePos.clone();
    if (hovered) {
      // Slide forward towards room center (towards camera / out of shelf)
      if (isRightShelf) {
        vec.x -= 0.35; // slide left out of shelf
        vec.z += 0.15; // slide slightly out
      } else {
        vec.x += 0.35; // slide right out of shelf
        vec.z += 0.15; // slide slightly out
      }
    }
    return vec;
  }, [basePos, hovered, book.shelfPosition.side]);

  // Target rotation angle (slight tilt on hover)
  const targetRotY = useMemo(() => {
    const isRightShelf = book.shelfPosition.side === 'right';
    if (hovered) {
      return isRightShelf ? Math.PI / 10 : -Math.PI / 10;
    }
    return book.tiltAngle || 0;
  }, [hovered, book.shelfPosition.side, book.tiltAngle]);

  const targetRotZ = useMemo(() => {
    if (hovered) return 0.08;
    return 0;
  }, [hovered]);

  // Smooth frame interpolation (Lerp) for book hover animation
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    const lerpFactor = 1 - Math.exp(-10 * delta);

    // Lerp Position
    meshRef.current.position.lerp(targetPos, lerpFactor);

    // Lerp Rotations
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, lerpFactor);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, lerpFactor);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onClick(book);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        onHover(book, e);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
        onHover(null);
      }}
    >
      <boxGeometry
        args={[
          book.dimensions.width,
          book.dimensions.height,
          book.dimensions.depth,
        ]}
      />
      {materials.map((mat, i) => (
        <primitive
          key={i}
          object={mat}
          attach={`material-${i}`}
          transparent={isFilteredOut}
          opacity={isFilteredOut ? 0.25 : 1.0}
        />
      ))}
    </mesh>
  );
};
