import * as THREE from 'three';
import { BookData } from '../types';

// Global texture cache to prevent expensive canvas redraws and VRAM allocations
const textureCache = new Map<string, THREE.CanvasTexture>();

function getCachedTexture(key: string, generator: () => THREE.CanvasTexture): THREE.CanvasTexture {
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }
  const tex = generator();
  textureCache.set(key, tex);
  return tex;
}

/**
 * Generate a dedicated gilded inscription texture (transparent background, no plaque)
 * with elegant gold calligraphy for Dua from Mohid.
 */
export function createDedicatedInscriptionTexture(): THREE.CanvasTexture {
  return getCachedTexture('dedicated_inscription_seamless', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Transparent background - no plaque or box!
    ctx.clearRect(0, 0, 1024, 512);

    // Soft subtle warm golden atmospheric halo behind lettering
    const haloGrad = ctx.createRadialGradient(512, 240, 30, 512, 240, 360);
    haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.16)');
    haloGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.05)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(512, 240, 360, 0, Math.PI * 2);
    ctx.fill();

    // Top icon/symbol: Open Book & Stars
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fde047';
    ctx.font = '36px Georgia, serif';
    ctx.fillText('📖  ✦  📖', 512, 90);

    // Deep drop shadow to simulate carved/gilded wood inlay
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;

    // Metallic gold gradient fill
    const goldGrad = ctx.createLinearGradient(0, 150, 0, 270);
    goldGrad.addColorStop(0, '#fffbeb');
    goldGrad.addColorStop(0.4, '#fde047');
    goldGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = goldGrad;

    // Main Text: "For my Book Friend"
    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillText('For my Book Friend', 512, 205);

    // Dedicated Subtitle: "to Dua - From Mohid"
    ctx.shadowBlur = 8;
    const subGrad = ctx.createLinearGradient(0, 280, 0, 360);
    subGrad.addColorStop(0, '#fef08a');
    subGrad.addColorStop(1, '#eab308');
    ctx.fillStyle = subGrad;

    ctx.font = 'italic 46px Georgia, serif';
    ctx.fillText('to Dua - From Mohid', 512, 325);

    // Reset shadow
    ctx.shadowColor = 'transparent';

    // Elegant thin golden filigree line below text
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(280, 395);
    ctx.lineTo(744, 395);
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(512, 395, 6, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  });
}

/**
 * Generate a rich dark mahogany/walnut wood texture with realistic organic grain and polished varnish shine.
 */
export function createWoodTexture(color = '#2c190e', secondaryColor = '#180c05', darkLines = true): THREE.CanvasTexture {
  const cacheKey = `wood_${color}_${secondaryColor}_${darkLines}`;
  return getCachedTexture(cacheKey, () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base rich wood color fill
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1024, 1024);

    // Organic fine wood pore pores & fiber streaks
    for (let i = 0; i < 900; i++) {
      const y = Math.random() * 1024;
      const thickness = 0.5 + Math.random() * 2.5;
      const opacity = 0.04 + Math.random() * 0.22;
      ctx.strokeStyle = Math.random() > 0.35 ? secondaryColor : (darkLines ? '#070301' : '#4d2b17');
      ctx.globalAlpha = opacity;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      let currentY = y;
      for (let x = 0; x <= 1024; x += 32) {
        currentY += (Math.random() - 0.5) * 3.5;
        ctx.lineTo(x, currentY);
      }
      ctx.stroke();
    }

    // Medullary ray flecks & satin wood swirls
    for (let k = 0; k < 6; k++) {
      const kx = Math.random() * 1024;
      const ky = Math.random() * 1024;
      const radius = 15 + Math.random() * 35;
      const grad = ctx.createRadialGradient(kx, ky, 2, kx, ky, radius);
      grad.addColorStop(0, '#060201');
      grad.addColorStop(0.4, secondaryColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(kx, ky, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Soft satin varnish coat sheen gradient overlay
    const varnishGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
    varnishGrad.addColorStop(0, 'rgba(255, 230, 200, 0.04)');
    varnishGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.08)');
    varnishGrad.addColorStop(1, 'rgba(255, 230, 200, 0.03)');
    ctx.fillStyle = varnishGrad;
    ctx.globalAlpha = 1.0;
    ctx.fillRect(0, 0, 1024, 1024);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  });
}

/**
 * Generate a procedural grayscale bump map for tactile wood grain depth.
 */
export function createWoodBumpMap(): THREE.CanvasTexture {
  return getCachedTexture('wood_bump', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 500; i++) {
      const y = Math.random() * 512;
      ctx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
      ctx.globalAlpha = 0.08 + Math.random() * 0.15;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      let currentY = y;
      for (let x = 0; x <= 512; x += 32) {
        currentY += (Math.random() - 0.5) * 3;
        ctx.lineTo(x, currentY);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  });
}

/**
 * Generate an intricate vintage patterned rug texture (Persian/Oriental style medallion rug).
 */
export function createVintageRugTexture(): THREE.CanvasTexture {
  return getCachedTexture('vintage_rug', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base deep crimson/maroon rug ground
    ctx.fillStyle = '#4a0e17';
    ctx.fillRect(0, 0, 1024, 1024);

    // Ornate double border frames
    const marginOuter = 40;
    const marginInner = 90;

    // Outer border background - Navy blue
    ctx.fillStyle = '#102238';
    ctx.fillRect(marginOuter, marginOuter, 1024 - marginOuter * 2, 1024 - marginOuter * 2);
    ctx.fillStyle = '#4a0e17';
    ctx.fillRect(marginInner, marginInner, 1024 - marginInner * 2, 1024 - marginInner * 2);

    // Gold decorative border lines
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(marginOuter + 10, marginOuter + 10, 1024 - (marginOuter + 10) * 2, 1024 - (marginOuter + 10) * 2);
    ctx.strokeRect(marginInner - 10, marginInner - 10, 1024 - (marginInner - 10) * 2, 1024 - (marginInner - 10) * 2);

    // Central Ornate Medallion
    const cx = 512;
    const cy = 512;
    
    // Concentric diamond & floral star layers
    for (let r = 240; r > 20; r -= 35) {
      ctx.fillStyle = (r / 35) % 2 === 0 ? '#d4af37' : ((r / 35) % 3 === 0 ? '#102238' : '#8c1c2b');
      ctx.beginPath();
      for (let a = 0; a < 8; a++) {
        const angle = (a * Math.PI) / 4;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#f3e5ab';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Four corner flourishes
    const corners = [
      [marginInner + 20, marginInner + 20],
      [1024 - marginInner - 20, marginInner + 20],
      [marginInner + 20, 1024 - marginInner - 20],
      [1024 - marginInner - 20, 1024 - marginInner - 20],
    ];

    corners.forEach(([cornerX, cornerY]) => {
      ctx.fillStyle = '#102238';
      ctx.beginPath();
      ctx.arc(cornerX, cornerY, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    // Custom Woven Gold Inscription directly on the carpet
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Dark woven cartouche background panel on the carpet
    const cartoucheGrad = ctx.createRadialGradient(512, 730, 20, 512, 730, 360);
    cartoucheGrad.addColorStop(0, '#102238');
    cartoucheGrad.addColorStop(0.75, '#0b1626');
    cartoucheGrad.addColorStop(1, 'rgba(11, 22, 38, 0)');
    ctx.fillStyle = cartoucheGrad;
    ctx.beginPath();
    ctx.ellipse(512, 730, 360, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden embroidered frame on carpet
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 4;
    ctx.strokeRect(210, 640, 604, 180);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(218, 648, 588, 164);

    // Shadow for woven embroidery effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;

    // Main text: "For my Book Friend"
    const textGold = ctx.createLinearGradient(0, 660, 0, 780);
    textGold.addColorStop(0, '#fffbeb');
    textGold.addColorStop(0.5, '#fde047');
    textGold.addColorStop(1, '#ca8a04');

    ctx.fillStyle = textGold;
    ctx.font = 'bold 56px Georgia, serif';
    ctx.fillText('For my Book Friend', 512, 695);

    // Subtitle: "to Dua - From Mohid"
    ctx.font = 'italic 42px Georgia, serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('to Dua - From Mohid', 512, 765);

    ctx.shadowColor = 'transparent';

    // Textile texture overlay (subtle woven mesh noise)
  ctx.fillStyle = '#000000';
  for (let i = 0; i < 30000; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    ctx.globalAlpha = 0.04;
    ctx.fillRect(rx, ry, 2, 2);
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
  });
}

/**
 * Generate book spine texture with crisp title, author, and ornate gold accents.
 */
export function createBookSpineTexture(book: BookData): THREE.CanvasTexture {
  return getCachedTexture(`spine_${book.id}`, () => {
    const canvas = document.createElement('canvas');
    // High res spine texture canvas
    canvas.width = 256;
    canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Background cover color
  ctx.fillStyle = book.primaryColor;
  ctx.fillRect(0, 0, 256, 1024);

  // Subtle leather texture noise
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * 256;
    const ry = Math.random() * 1024;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.globalAlpha = 0.03 + Math.random() * 0.04;
    ctx.fillRect(rx, ry, 3, 3);
  }
  ctx.globalAlpha = 1.0;

  // Ornate decorative borders / ribbing on top and bottom of spine
  ctx.strokeStyle = book.accentColor;
  ctx.lineWidth = 6;

  if (book.spinePattern === 'gold-lines' || book.spinePattern === 'vintage-leather') {
    // Top ribs
    ctx.beginPath();
    ctx.moveTo(20, 40); ctx.lineTo(236, 40);
    ctx.moveTo(20, 52); ctx.lineTo(236, 52);
    ctx.moveTo(20, 970); ctx.lineTo(236, 970);
    ctx.moveTo(20, 982); ctx.lineTo(236, 982);
    ctx.stroke();
  } else if (book.spinePattern === 'ornate-border') {
    // Ornate frame box around spine
    ctx.strokeRect(18, 25, 220, 974);
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 33, 204, 958);
  } else if (book.spinePattern === 'botanical') {
    // Leaf vine along spine
    ctx.fillStyle = book.accentColor;
    for (let y = 60; y < 960; y += 80) {
      if (y < 250 || y > 750) {
        ctx.beginPath();
        ctx.ellipse(40, y, 12, 6, Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(216, y, 12, 6, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Vertical spine title & author text (Rotated 90 degrees)
  ctx.save();
  ctx.translate(128, 512);
  ctx.rotate(Math.PI / 2);

  // Book Title
  ctx.fillStyle = book.accentColor;
  ctx.font = 'bold 38px "Playfair Display", "Georgia", "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Truncate title if too long for spine
  let displayTitle = book.title;
  if (displayTitle.length > 28) {
    displayTitle = displayTitle.substring(0, 26) + '...';
  }
  
  // Draw glowing text shadow
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 6;
  ctx.fillText(displayTitle.toUpperCase(), -40, 0);

  // Author Name
  ctx.font = 'italic 26px "Cinzel", "Georgia", serif';
  ctx.fillStyle = book.accentColor === '#d4af37' ? '#fef08a' : book.accentColor;
  ctx.shadowBlur = 4;
  ctx.fillText(book.author, 260, 0);

  ctx.restore();

  // Draw story emblem near bottom of spine
  if (book.storyMotif) {
    drawStoryMotif(ctx, book.storyMotif, 128, 825, 0.55, book.accentColor, book.primaryColor);
  }

  // Bottom Publisher Logo Emblem
  ctx.fillStyle = book.accentColor;
  ctx.beginPath();
  ctx.arc(128, 930, 14, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
  });
}

/**
 * Generate a procedural high-detail sunflower seed center disk texture
 * with light, warm golden-amber and soft brown tones.
 */
export function createSunflowerSeedTexture(): THREE.CanvasTexture {
  return getCachedTexture('sunflower_seed', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const cx = 256;
  const cy = 256;

  // Background light warm amber-brown fill
  ctx.fillStyle = '#4a2910';
  ctx.fillRect(0, 0, 512, 512);

  // Concentric radial gradient fill for bright, luminous disk floret transition
  const baseGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 250);
  baseGrad.addColorStop(0.0, '#3d200a');  // Soft warm cocoa center
  baseGrad.addColorStop(0.40, '#5c3314'); // Rich warm caramel brown
  baseGrad.addColorStop(0.70, '#9a5312'); // Light golden amber
  baseGrad.addColorStop(0.88, '#d97706'); // Bright golden yellow pollen ring
  baseGrad.addColorStop(1.0, '#84cc16');  // Fresh lime calyx rim

  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 250, 0, Math.PI * 2);
  ctx.fill();

  // Golden Angle Phyllotaxis spiral seed dots in light warm hues
  const totalSeeds = 1100;
  const goldenAngle = 137.508 * (Math.PI / 180);
  const scalingFactor = 6.8;

  for (let i = 0; i < totalSeeds; i++) {
    const r = scalingFactor * Math.sqrt(i);
    if (r > 245) break;

    const theta = i * goldenAngle;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);

    const normR = r / 245;
    let color: string;
    let seedRadius: number;

    if (normR < 0.35) {
      // Inner warm brown seeds
      color = Math.random() > 0.3 ? '#42230c' : '#573013';
      seedRadius = 2.2;
    } else if (normR < 0.72) {
      // Mid disc floret golden amber seeds
      color = Math.random() > 0.4 ? '#854d0e' : '#a16207';
      seedRadius = 2.6;
    } else if (normR < 0.92) {
      // Outer radiant yellow-gold opening florets
      color = Math.random() > 0.3 ? '#eab308' : '#facc15';
      seedRadius = 3.0;
    } else {
      // Fresh green edge florets
      color = '#a3e635';
      seedRadius = 2.4;
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, seedRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
  });
}

/**
 * Generate a soft procedural bump map for subtle 3D depth on the sunflower seed center disk.
 */
export function createSunflowerSeedBumpMap(): THREE.CanvasTexture {
  return getCachedTexture('sunflower_seed_bump', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const cx = 256;
    const cy = 256;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    const totalSeeds = 1100;
    const goldenAngle = 137.508 * (Math.PI / 180);
    const scalingFactor = 6.8;

    for (let i = 0; i < totalSeeds; i++) {
      const r = scalingFactor * Math.sqrt(i);
      if (r > 245) break;

      const theta = i * goldenAngle;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);

      const grad = ctx.createRadialGradient(x, y, 0.5, x, y, 2.5);
      grad.addColorStop(0, '#d0d0d0');
      grad.addColorStop(0.7, '#989898');
      grad.addColorStop(1, '#808080');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  });
}


/**
 * Generate Book Front Cover Texture with story-based artwork motifs.
 */
export function createBookCoverTexture(book: BookData): THREE.CanvasTexture {
  return getCachedTexture(`cover_${book.id}`, () => {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Cover base color
  ctx.fillStyle = book.primaryColor;
  ctx.fillRect(0, 0, 768, 1024);

  // Subtle paper grain texture
  for (let i = 0; i < 8000; i++) {
    const rx = Math.random() * 768;
    const ry = Math.random() * 1024;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.globalAlpha = 0.03;
    ctx.fillRect(rx, ry, 2, 2);
  }
  ctx.globalAlpha = 1.0;

  // Gold ornate frame
  ctx.strokeStyle = book.accentColor;
  ctx.lineWidth = 12;
  ctx.strokeRect(36, 36, 768 - 72, 1024 - 72);
  ctx.lineWidth = 3;
  ctx.strokeRect(52, 52, 768 - 104, 1024 - 104);

  // Decorative corner crests
  const corners = [
    [52, 52], [768 - 52, 52], [52, 1024 - 52], [768 - 52, 1024 - 52]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = book.accentColor;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
  });

  // Title on front cover (Top section)
  ctx.fillStyle = book.accentColor;
  ctx.font = 'bold 48px "Playfair Display", "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Wrap title lines
  const words = book.title.split(' ');
  let line = '';
  const lines: string[] = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 560 && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const startY = 160;
  lines.forEach((l, idx) => {
    ctx.fillText(l.trim(), 384, startY + idx * 58);
  });

  // Top/Middle divider rule
  const dividerY = startY + lines.length * 58 + 15;
  ctx.beginPath();
  ctx.moveTo(240, dividerY);
  ctx.lineTo(528, dividerY);
  ctx.stroke();

  // Draw story-based central artwork motif according to book's plot & theme
  if (book.storyMotif) {
    const motifY = Math.min(540, dividerY + 180);
    drawStoryMotif(ctx, book.storyMotif, 384, motifY, 1.75, book.accentColor, book.primaryColor);
  }

  // Author Name (Lower section)
  ctx.font = 'italic 34px "Georgia", serif';
  ctx.fillStyle = book.accentColor;
  ctx.fillText(book.author, 384, 780);

  // Bottom decorative rule & Genre badge
  ctx.beginPath();
  ctx.moveTo(280, 830);
  ctx.lineTo(488, 830);
  ctx.stroke();

  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(book.genre.toUpperCase(), 384, 880);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
  });
}

/**
 * Draw custom story-based illustration/symbol/motif on book covers and spines.
 */
export function drawStoryMotif(
  ctx: CanvasRenderingContext2D,
  motif: string | undefined,
  cx: number,
  cy: number,
  scale: number = 1.0,
  accentColor: string = '#d4af37',
  primaryColor: string = '#1a1a1a'
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.strokeStyle = accentColor;
  ctx.fillStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (motif) {
    case 'wolf': {
      // Full moon background
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(0, -10, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Pine trees silhouette
      ctx.beginPath();
      ctx.moveTo(-45, 30); ctx.lineTo(-35, 10); ctx.lineTo(-40, 10); ctx.lineTo(-30, -10); ctx.lineTo(-35, -10); ctx.lineTo(-25, -30); ctx.lineTo(-20, -30); ctx.lineTo(-30, 30);
      ctx.moveTo(45, 30); ctx.lineTo(35, 10); ctx.lineTo(40, 10); ctx.lineTo(30, -10); ctx.lineTo(35, -10); ctx.lineTo(25, -30); ctx.lineTo(20, -30); ctx.lineTo(30, 30);
      ctx.fill();

      // Howling Wolf silhouette
      ctx.beginPath();
      ctx.moveTo(-15, 30);
      ctx.quadraticCurveTo(-12, 10, -8, -5);
      ctx.quadraticCurveTo(-5, -20, 12, -38);
      ctx.quadraticCurveTo(18, -32, 10, -22);
      ctx.quadraticCurveTo(5, -18, 0, -10);
      ctx.quadraticCurveTo(-3, -2, 5, 5);
      ctx.quadraticCurveTo(10, 15, 18, 30);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'sun-water': {
      // Radiant sunburst with water ripples
      ctx.beginPath();
      ctx.arc(0, -15, 20, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 26, -15 + Math.sin(angle) * 26);
        ctx.lineTo(Math.cos(angle) * 42, -15 + Math.sin(angle) * 42);
        ctx.stroke();
      }

      ctx.beginPath(); ctx.arc(0, 25, 35, 0.1, Math.PI - 0.1); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 32, 22, 0.2, Math.PI - 0.2); ctx.stroke();
      break;
    }

    case 'regency-cameo': {
      // Oval Regency frame
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 48, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 0.2;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Lady profile outline inside cameo
      ctx.beginPath();
      ctx.moveTo(-10, -22);
      ctx.quadraticCurveTo(5, -28, 12, -15);
      ctx.quadraticCurveTo(8, -5, 4, 0);
      ctx.quadraticCurveTo(12, 10, -12, 22);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-25, -45); ctx.quadraticCurveTo(0, -55, 25, -45);
      ctx.moveTo(-25, 45); ctx.quadraticCurveTo(0, 55, 25, 45);
      ctx.stroke();
      break;
    }

    case 'midnight-clock': {
      // Ornate clock face at 12:00
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, -5, 40, 0, Math.PI * 2); ctx.stroke();

      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -5); ctx.lineTo(0, -32);
      ctx.moveTo(0, -5); ctx.lineTo(0, -20);
      ctx.stroke();

      ctx.font = 'bold 10px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('XII', 0, -38);
      ctx.fillText('VI', 0, 28);
      ctx.fillText('III', 32, -5);
      ctx.fillText('IX', -32, -5);

      ctx.beginPath(); ctx.rect(-10, 10, 20, 30); ctx.stroke();
      break;
    }

    case 'people-loop': {
      // Modern continuous line art
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-25, -30);
      ctx.quadraticCurveTo(-15, -15, -12, -5);
      ctx.quadraticCurveTo(-20, 0, -12, 5);
      ctx.quadraticCurveTo(-25, 15, -10, 30);
      ctx.bezierCurveTo(0, 20, 0, -20, 10, -30);
      ctx.quadraticCurveTo(15, -15, 12, -5);
      ctx.quadraticCurveTo(20, 0, 12, 5);
      ctx.quadraticCurveTo(25, 15, 25, 30);
      ctx.stroke();
      break;
    }

    case 'atom-nucleus': {
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();

      ctx.lineWidth = 2;
      for (let a = 0; a < 3; a++) {
        const rot = (a * Math.PI) / 3;
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, 42, 14, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      break;
    }

    case 'alchemy-pyramid': {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -35); ctx.lineTo(-38, 25); ctx.lineTo(38, 25); ctx.closePath();
      ctx.stroke();

      ctx.beginPath(); ctx.moveTo(0, -35); ctx.lineTo(8, 25); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -48, 8, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case 'four-roses': {
      const rosePos = [[-16, -16], [16, -16], [-16, 16], [16, 16]];
      rosePos.forEach(([rx, ry]) => {
        ctx.beginPath(); ctx.arc(rx, ry, 10, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(rx, ry, 5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.beginPath(); ctx.moveTo(-25, 32); ctx.quadraticCurveTo(0, 20, 25, 32); ctx.stroke();
      break;
    }

    case 'mountain-peak': {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -40); ctx.lineTo(25, 25); ctx.lineTo(-25, 25); ctx.closePath();
      ctx.moveTo(-20, -10); ctx.lineTo(-42, 25);
      ctx.moveTo(20, -10); ctx.lineTo(42, 25);
      ctx.stroke();

      ctx.beginPath(); ctx.moveTo(-8, -25); ctx.lineTo(0, -18); ctx.lineTo(8, -25); ctx.stroke();
      break;
    }

    case 'domino-raven': {
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.quadraticCurveTo(-30, -35, -40, -10);
      ctx.quadraticCurveTo(-15, -5, 0, 5);
      ctx.quadraticCurveTo(15, -5, 40, -10);
      ctx.quadraticCurveTo(30, -35, 0, -25);
      ctx.fill();

      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(-25 + i * 16, 20);
        ctx.rotate(-0.2 * i);
        ctx.strokeRect(-6, -12, 12, 24);
        ctx.restore();
      }
      break;
    }

    case 'art-deco': {
      ctx.lineWidth = 3;
      for (let r = 15; r <= 45; r += 10) {
        ctx.beginPath(); ctx.arc(0, 25, r, Math.PI, Math.PI * 2); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(0, 25); ctx.lineTo(0, -45); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -45, 6, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case 'mockingbird': {
      ctx.beginPath(); ctx.moveTo(-40, 15); ctx.quadraticCurveTo(0, 25, 40, 10); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, 16, 10, -Math.PI / 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-12, 2); ctx.lineTo(-28, 12); ctx.lineTo(-22, 0); ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, -5); ctx.lineTo(22, -8); ctx.lineTo(12, -2); ctx.fill();
      break;
    }

    case 'all-seeing-eye': {
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(-40, 25); ctx.lineTo(40, 25); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -5, 20, 10, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -5, 5, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case 'sandworm-dunes': {
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-45, 10); ctx.quadraticCurveTo(-15, -10, 15, 15); ctx.quadraticCurveTo(30, 25, 45, 10); ctx.stroke();
      ctx.beginPath(); ctx.arc(-20, -25, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(15, -32, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(20, 5, 14, Math.PI, Math.PI * 1.8); ctx.stroke();
      break;
    }

    case 'windswept-tree': {
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 35); ctx.quadraticCurveTo(-5, 10, -15, -10); ctx.stroke();
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-15, -10); ctx.quadraticCurveTo(10, -25, 35, -20);
      ctx.moveTo(-10, 0); ctx.quadraticCurveTo(15, -10, 30, -5);
      ctx.moveTo(-5, 15); ctx.quadraticCurveTo(15, 5, 28, 12);
      ctx.stroke();
      break;
    }

    case 'thorns-rose': {
      ctx.beginPath(); ctx.arc(0, -15, 14, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 35); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(-8, 5); ctx.moveTo(0, 22); ctx.lineTo(8, 17); ctx.stroke();
      break;
    }

    case 'dragon-ring': {
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 10, 25, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(-25, -20); ctx.lineTo(-12, -22); ctx.lineTo(-35, -5); ctx.lineTo(-10, -12);
      ctx.lineTo(0, -28);
      ctx.lineTo(10, -12); ctx.lineTo(35, -5); ctx.lineTo(12, -22); ctx.lineTo(25, -20);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'cave-handprint': {
      ctx.beginPath(); ctx.arc(0, 5, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(-12, -18, 4, 16); ctx.fillRect(-6, -24, 4, 20); ctx.fillRect(0, -26, 4, 22); ctx.fillRect(6, -22, 4, 18); ctx.fillRect(11, -12, 4, 14);
      break;
    }

    case 'lightning-bolt': {
      ctx.strokeRect(-15, -10, 30, 45);
      ctx.beginPath(); ctx.moveTo(-18, -10); ctx.lineTo(0, -35); ctx.lineTo(18, -10); ctx.closePath(); ctx.fill();
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(25, -45); ctx.lineTo(5, -20); ctx.lineTo(15, -20); ctx.lineTo(-10, 15); ctx.stroke();
      break;
    }

    case 'portrait-rose': {
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.ellipse(0, -5, 25, 35, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -5, 8, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case 'stag-antlers': {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-5, -5); ctx.quadraticCurveTo(-20, -25, -30, -40);
      ctx.moveTo(-15, -20); ctx.lineTo(-32, -20); ctx.moveTo(-22, -30); ctx.lineTo(-12, -38);
      ctx.moveTo(5, -5); ctx.quadraticCurveTo(20, -25, 30, -40);
      ctx.moveTo(15, -20); ctx.lineTo(32, -20); ctx.moveTo(22, -30); ctx.lineTo(12, -38);
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-8, -5); ctx.lineTo(0, 20); ctx.lineTo(8, -5); ctx.closePath(); ctx.fill();
      break;
    }

    case 'scales-axe': {
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, -35); ctx.lineTo(0, 25); ctx.moveTo(-30, -20); ctx.lineTo(30, -20); ctx.stroke();
      ctx.beginPath(); ctx.arc(-30, 5, 12, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(30, 5, 12, 0, Math.PI); ctx.stroke();
      break;
    }

    case 'cemetery-gate': {
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -10, 30, Math.PI, Math.PI * 2); ctx.lineTo(30, 30); ctx.moveTo(-30, -10); ctx.lineTo(-30, 30); ctx.stroke();
      for (let x = -20; x <= 20; x += 10) {
        ctx.beginPath(); ctx.moveTo(x, -10); ctx.lineTo(x, 30); ctx.stroke();
      }
      break;
    }

    case 'barbed-sun': {
      ctx.beginPath(); ctx.arc(0, -10, 16, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-45, 15); ctx.lineTo(45, 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-15, 10); ctx.lineTo(-5, 20); ctx.moveTo(15, 10); ctx.lineTo(25, 20); ctx.stroke();
      break;
    }

    case 'compass-ship': {
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -32); ctx.lineTo(6, -8); ctx.lineTo(0, 0); ctx.lineTo(-6, -8); ctx.closePath();
      ctx.moveTo(0, 32); ctx.lineTo(6, 8); ctx.lineTo(0, 0); ctx.lineTo(-6, 8); ctx.closePath();
      ctx.moveTo(-32, 0); ctx.lineTo(-8, 6); ctx.lineTo(0, 0); ctx.lineTo(-8, -6); ctx.closePath();
      ctx.moveTo(32, 0); ctx.lineTo(8, 6); ctx.lineTo(0, 0); ctx.lineTo(-8, -6); ctx.closePath();
      ctx.fill();
      break;
    }

    case 'tralfamadore-time': {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, -30); ctx.lineTo(20, -30); ctx.lineTo(-20, 30); ctx.lineTo(20, 30); ctx.closePath();
      ctx.stroke();
      break;
    }

    case 'greek-column': {
      ctx.lineWidth = 3;
      ctx.strokeRect(-16, -20, 32, 45);
      ctx.fillRect(-22, -28, 44, 8);
      ctx.beginPath();
      ctx.moveTo(-8, -20); ctx.lineTo(-8, 25);
      ctx.moveTo(0, -20); ctx.lineTo(0, 25);
      ctx.moveTo(8, -20); ctx.lineTo(8, 25);
      ctx.stroke();
      break;
    }

    case 'magnifying-pipe': {
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(-5, -10, 22, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, 5); ctx.lineTo(30, 25); ctx.stroke();
      break;
    }

    case 'phoenix-flame': {
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.quadraticCurveTo(-30, -20, -40, 10);
      ctx.quadraticCurveTo(-15, 10, 0, -10);
      ctx.quadraticCurveTo(15, 10, 40, 10);
      ctx.quadraticCurveTo(30, -20, 0, -35);
      ctx.fill();
      ctx.beginPath(); ctx.moveTo(-10, 25); ctx.lineTo(0, 5); ctx.lineTo(10, 25); ctx.stroke();
      break;
    }

    case 'greek-ship': {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-40, 0);
      ctx.quadraticCurveTo(0, 25, 40, -5);
      ctx.lineTo(30, -5);
      ctx.quadraticCurveTo(0, 10, -30, 0);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -38); ctx.quadraticCurveTo(18, -20, 0, -5); ctx.fill();
      break;
    }

    case 'yellow-butterflies': {
      const bf = [[0, -10, 1.2], [-20, 15, 0.8], [20, 15, 0.8]];
      bf.forEach(([bx, by, bscale]) => {
        ctx.save();
        ctx.translate(bx, by);
        ctx.scale(bscale, bscale);
        ctx.beginPath();
        ctx.ellipse(-8, -6, 8, 12, -Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(8, -6, 8, 12, Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(-6, 6, 6, 8, Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(6, 6, 6, 8, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      break;
    }

    default: {
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 10, Math.sin(a) * 10);
        ctx.lineTo(Math.cos(a) * 32, Math.sin(a) * 32);
        ctx.stroke();
      }
      break;
    }
  }

  ctx.restore();
}

/**
 * Generate Book Pages (Paper edge texture)
 */
export function createBookPagesTexture(): THREE.CanvasTexture {
  return getCachedTexture('book_pages', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Warm off-white parchment paper color
    ctx.fillStyle = '#f4eedd';
    ctx.fillRect(0, 0, 256, 512);

    // Page horizontal line stack effect
    ctx.fillStyle = '#d9d0bc';
    for (let y = 0; y < 512; y += 4) {
      if (Math.random() > 0.3) {
        ctx.fillRect(0, y, 256, 1.5);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  });
}

/**
 * Generate Sunset Sky Background Texture for the central window.
 */
export function createSunsetSkyTexture(): THREE.CanvasTexture {
  return getCachedTexture('sunset_sky', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Sky Gradient: Deep Violet -> Rose Pink -> Golden Orange -> Warm Sunset Yellow
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0.0, '#2d114d'); // Deep twilight purple
    grad.addColorStop(0.35, '#85215c'); // Magenta sunset
    grad.addColorStop(0.65, '#d9532f'); // Vibrant orange
    grad.addColorStop(0.85, '#f59e0b'); // Golden amber
    grad.addColorStop(1.0, '#fef08a'); // Warm yellow horizon

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Glowing Sun near horizon
    const sunX = 512;
    const sunY = 720;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 260);
    sunGrad.addColorStop(0.0, 'rgba(255, 255, 240, 1.0)');
    sunGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.9)');
    sunGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
    sunGrad.addColorStop(1.0, 'rgba(217, 83, 47, 0.0)');

    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 260, 0, Math.PI * 2);
    ctx.fill();

    // Soft wispy clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    for (let c = 0; c < 12; c++) {
      const cx = Math.random() * 1024;
      const cy = 200 + Math.random() * 400;
      const rx = 120 + Math.random() * 200;
      const ry = 20 + Math.random() * 40;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant mountain & pine tree silhouettes along horizon
    ctx.fillStyle = '#1e0c29';
    ctx.beginPath();
    ctx.moveTo(0, 1024);
    let hy = 760;
    for (let x = 0; x <= 1024; x += 40) {
      hy += (Math.random() - 0.5) * 35;
      ctx.lineTo(x, hy);
    }
    ctx.lineTo(1024, 1024);
    ctx.closePath();
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  });
}


