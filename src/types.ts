export interface BookData {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  description: string;
  quote: string;
  excerpt: string;
  primaryColor: string;
  accentColor: string;
  spinePattern: 'gold-lines' | 'ornate-border' | 'minimal-modern' | 'vintage-leather' | 'botanical';
  shelfPosition: {
    side: 'left' | 'right';
    shelfIndex: number; // 0 to 4 (bottom to top)
    posOnShelf: number; // position from left to right on that shelf
  };
  dimensions: {
    width: number;  // x size (spine width / thickness)
    height: number; // y size (book height)
    depth: number;  // z size (book depth/length)
  };
  tiltAngle?: number; // optional tilt (e.g., leaning against shelf or neighboring book)
  isFeatured?: boolean;
  readUrl: string; // Link to read the book online (Gutenberg, Internet Archive, Open Library, Google Books)
  storyMotif?: string; // Story-based artwork motif identifier
}

export type CameraPreset = 'overview' | 'left-shelf' | 'right-shelf' | 'window-view' | 'cozy-corner';

export type TimeOfDay = 'sunset' | 'twilight' | 'candlelight' | 'golden-morning';

export interface AmbientAudioState {
  isPlaying: boolean;
  volume: number;
  soundType: 'fireplace' | 'rain' | 'piano' | 'breeze';
}
