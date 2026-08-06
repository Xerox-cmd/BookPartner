import React, { useMemo } from 'react';
import * as THREE from 'three';
import { BookData } from '../../types';
import { Book3D } from './Book3D';
import { IvyVines } from './IvyVines';
import { Sunflower, SunflowerVase } from './Sunflowers';
import { createWoodTexture, createWoodBumpMap } from '../../utils/textureGenerator';

interface BookShelfProps {
  side: 'left' | 'right';
  position: [number, number, number];
  books: BookData[];
  onHoverBook: (book: BookData | null, e?: THREE.Event) => void;
  onClickBook: (book: BookData) => void;
  filteredBookIds?: string[];
}

export const BookShelf: React.FC<BookShelfProps> = ({
  side,
  position,
  books,
  onHoverBook,
  onClickBook,
  filteredBookIds = [],
}) => {
  // Photorealistic dark mahogany wood texture & bump map
  const woodTexture = useMemo(() => createWoodTexture('#442312', '#231006'), []);
  const woodBumpMap = useMemo(() => createWoodBumpMap(), []);

  const woodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: woodTexture,
      bumpMap: woodBumpMap,
      bumpScale: 0.008,
      roughness: 0.35,
      metalness: 0.06,
      color: '#5f351c',
    });
  }, [woodTexture, woodBumpMap]);

  const darkWoodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: woodTexture,
      bumpMap: woodBumpMap,
      bumpScale: 0.012,
      roughness: 0.42,
      metalness: 0.05,
      color: '#442312',
    });
  }, [woodTexture, woodBumpMap]);

  const goldAccentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#fbbf24',
      roughness: 0.25,
      metalness: 0.85,
    });
  }, []);

  // Dimensions of bookcase
  const width = 0.8;   // X depth into wall
  const length = 5.2;  // Z length along wall
  const height = 5.6;  // Y height

  // Shelf Y elevations
  const shelfYPositions = [-2.2, -1.0, 0.2, 1.4, 2.6];

  // Map books to 3D positions on shelves
  const bookElements = useMemo(() => {
    const sideBooks = books.filter((b) => b.shelfPosition.side === side);

    return sideBooks.map((book) => {
      const shelfIndex = book.shelfPosition.shelfIndex;
      const shelfY = shelfYPositions[shelfIndex] ?? shelfYPositions[2];

      const posOnShelf = book.shelfPosition.posOnShelf;
      const startZ = -length / 2 + 0.6;
      const spacingZ = 0.65;
      const bookZ = startZ + posOnShelf * spacingZ;

      const bookX = side === 'left' ? 0.05 : -0.05;
      const bookY = shelfY + book.dimensions.height / 2 + 0.04;

      const isFilteredOut =
        filteredBookIds.length > 0 && !filteredBookIds.includes(book.id);

      return (
        <Book3D
          key={book.id}
          book={book}
          position={[bookX, bookY, bookZ]}
          onHover={onHoverBook}
          onClick={onClickBook}
          isFilteredOut={isFilteredOut}
        />
      );
    });
  }, [books, side, onHoverBook, onClickBook, filteredBookIds, length, shelfYPositions]);

  // Dentil molding blocks along top header
  const dentilBlocks = useMemo(() => {
    const blocks = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const z = -length / 2 + 0.2 + (i * (length - 0.4)) / (count - 1);
      blocks.push(z);
    }
    return blocks;
  }, [length]);

  return (
    <group position={position}>
      {/* 1. Recessed Wood Back Panel with Vertical Wainscoting Grooves */}
      <mesh
        position={[side === 'left' ? -width / 2 + 0.02 : width / 2 - 0.02, 0, 0]}
        material={darkWoodMaterial}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[0.04, height, length]} />
      </mesh>

      {/* 2. Classical Layered Crown Molding Cornice Header */}
      {/* Base Architrave Band */}
      <mesh position={[0, height / 2 + 0.06, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[width + 0.16, 0.12, length + 0.32]} />
      </mesh>
      {/* Dentil Molding Strip */}
      {dentilBlocks.map((zPos, idx) => (
        <mesh
          key={idx}
          position={[side === 'left' ? 0.1 : -0.1, height / 2 + 0.13, zPos]}
          material={woodMaterial}
          castShadow
        >
          <boxGeometry args={[width + 0.18, 0.06, 0.12]} />
        </mesh>
      ))}
      {/* Middle Projection Tier */}
      <mesh position={[0, height / 2 + 0.2, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[width + 0.26, 0.12, length + 0.42]} />
      </mesh>
      {/* Upper Crown Cap */}
      <mesh position={[0, height / 2 + 0.32, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[width + 0.36, 0.14, length + 0.52]} />
      </mesh>

      {/* 3. Bottom Plinth Base with Bevelled Baseboard */}
      <mesh position={[0, -height / 2 - 0.08, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[width + 0.18, 0.16, length + 0.34]} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.2, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[width + 0.28, 0.12, length + 0.44]} />
      </mesh>

      {/* 4. Fluted Classical Pilaster Columns on Left & Right Ends */}
      {[-length / 2 - 0.05, length / 2 + 0.05].map((pillarZ, idx) => (
        <group key={idx} position={[0, 0, pillarZ]}>
          {/* Main Column Body */}
          <mesh material={woodMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.18, height - 0.4, 24]} />
          </mesh>

          {/* Vertical Column Fluting Strips */}
          {[0, 1, 2, 3, 4, 5].map((fIdx) => {
            const rotA = (fIdx * Math.PI) / 3;
            return (
              <mesh
                key={fIdx}
                position={[Math.cos(rotA) * 0.155, 0, Math.sin(rotA) * 0.155]}
                rotation={[0, rotA, 0]}
                material={darkWoodMaterial}
              >
                <boxGeometry args={[0.03, height - 0.5, 0.02]} />
              </mesh>
            );
          })}

          {/* Carved Column Capital Header */}
          <mesh position={[0, height / 2 - 0.18, 0]} material={woodMaterial} castShadow>
            <boxGeometry args={[0.42, 0.16, 0.42]} />
          </mesh>
          <mesh position={[0, height / 2 - 0.24, 0]} material={goldAccentMaterial}>
            <torusGeometry args={[0.18, 0.025, 12, 24]} />
          </mesh>

          {/* Carved Column Base Plinth */}
          <mesh position={[0, -height / 2 + 0.18, 0]} material={woodMaterial} castShadow>
            <boxGeometry args={[0.42, 0.16, 0.42]} />
          </mesh>
        </group>
      ))}

      {/* 5. Shelf Horizontal Planks with Moulded Front Edges & Gold Accent Lines */}
      {shelfYPositions.map((yPos, idx) => (
        <group key={idx} position={[0, yPos, 0]}>
          {/* Main Solid Oak/Mahogany Plank */}
          <mesh material={woodMaterial} castShadow receiveShadow>
            <boxGeometry args={[width, 0.09, length]} />
          </mesh>
          {/* Moulded Bevelled Front Lip */}
          <mesh position={[side === 'left' ? width / 2 + 0.02 : -width / 2 - 0.02, 0, 0]} material={woodMaterial} castShadow>
            <boxGeometry args={[0.05, 0.12, length + 0.04]} />
          </mesh>
          {/* Subtle Inlaid Gold Brass Strip on Shelf Edge */}
          <mesh position={[side === 'left' ? width / 2 + 0.045 : -width / 2 - 0.045, 0, 0]} material={goldAccentMaterial}>
            <boxGeometry args={[0.01, 0.02, length]} />
          </mesh>
        </group>
      ))}

      {/* 6. Climbing Ivy Vines & Roses wrapping the classical bookcase */}
      <IvyVines
        position={[
          side === 'left' ? 0.35 : -0.35,
          -2.2,
          -length / 2 - 0.05,
        ]}
        leafDensity={55}
        scale={[1.1, 1.3, 1.1]}
      />
      <IvyVines
        position={[
          side === 'left' ? 0.35 : -0.35,
          -1.5,
          length / 2 + 0.05,
        ]}
        leafDensity={45}
        scale={[1.0, 1.2, 1.0]}
      />
      <IvyVines
        position={[
          side === 'left' ? 0.2 : -0.2,
          2.6,
          -0.8,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        leafDensity={40}
        scale={[0.9, 0.9, 0.9]}
      />

      {/* Sunflowers interspersed on shelf edges and top */}
      <Sunflower
        position={[side === 'left' ? 0.1 : -0.1, 2.55, 0.8]}
        rotation={[0.3, side === 'left' ? -0.4 : 0.4, 0]}
        scale={0.7}
        stemHeight={0.35}
      />
      <SunflowerVase
        position={[side === 'left' ? 0.12 : -0.12, 1.3, -1.2]}
        scale={0.45}
      />

      {/* 3D Books on Shelves */}
      {bookElements}
    </group>
  );
};

