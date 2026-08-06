import React, { useState, useMemo, useEffect } from 'react';
import { BOOKS_COLLECTION } from './data/booksData';
import { BookData, CameraPreset, TimeOfDay } from './types';
import { LibraryScene } from './components/3d/LibraryScene';
import { LibraryHeaderUI } from './components/ui/LibraryHeaderUI';
import { BookCardOverlay } from './components/ui/BookCardOverlay';
import { BookModal } from './components/ui/BookModal';
import { BookmarksModal } from './components/ui/BookmarksModal';

export default function App() {
  const [hoveredBook, setHoveredBook] = useState<BookData | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('sunset');
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Local storage bookmarks persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('library_bookmarks');
      return saved ? JSON.parse(saved) : ['loving-caring', 'women-who-run-wolves'];
    } catch {
      return ['loving-caring', 'women-who-run-wolves'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('library_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {}
  }, [bookmarkedIds]);

  const toggleBookmark = (bookId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  // Unique genres
  const genres = useMemo(() => {
    const gSet = new Set<string>();
    BOOKS_COLLECTION.forEach((b) => gSet.add(b.genre));
    return Array.from(gSet).sort();
  }, []);

  // Filtered books logic
  const filteredBookIds = useMemo(() => {
    let result = BOOKS_COLLECTION;

    if (selectedGenre !== 'All') {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    return result.map((b) => b.id);
  }, [searchQuery, selectedGenre]);

  // Bookmarked books object list
  const bookmarkedBooks = useMemo(() => {
    return BOOKS_COLLECTION.filter((b) => bookmarkedIds.includes(b.id));
  }, [bookmarkedIds]);

  // Next / Prev Book Navigation inside Modal
  const currentBookIndex = useMemo(() => {
    if (!selectedBook) return -1;
    return BOOKS_COLLECTION.findIndex((b) => b.id === selectedBook.id);
  }, [selectedBook]);

  const handleSelectNext = () => {
    if (currentBookIndex < 0) return;
    const nextIdx = (currentBookIndex + 1) % BOOKS_COLLECTION.length;
    setSelectedBook(BOOKS_COLLECTION[nextIdx]);
  };

  const handleSelectPrev = () => {
    if (currentBookIndex < 0) return;
    const prevIdx = (currentBookIndex - 1 + BOOKS_COLLECTION.length) % BOOKS_COLLECTION.length;
    setSelectedBook(BOOKS_COLLECTION[prevIdx]);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0a0503] font-sans select-none relative">
      {/* Top Controls & Search Bar */}
      <LibraryHeaderUI
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        genres={genres}
        activeCameraPreset={cameraPreset}
        onSelectCameraPreset={setCameraPreset}
        timeOfDay={timeOfDay}
        onSelectTimeOfDay={setTimeOfDay}
        bookmarkedCount={bookmarkedIds.length}
        onOpenBookmarksModal={() => setIsBookmarksOpen(true)}
      />

      {/* 3D Photorealistic Library Room Canvas */}
      <LibraryScene
        books={BOOKS_COLLECTION}
        onHoverBook={setHoveredBook}
        onClickBook={setSelectedBook}
        filteredBookIds={filteredBookIds}
        cameraPreset={cameraPreset}
        timeOfDay={timeOfDay}
      />

      {/* Hover Card Floating Overlay */}
      <BookCardOverlay
        book={hoveredBook}
        onInspect={setSelectedBook}
      />

      {/* Detailed Book Modal Dialog */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onSelectNext={handleSelectNext}
        onSelectPrev={handleSelectPrev}
        isBookmarked={selectedBook ? bookmarkedIds.includes(selectedBook.id) : false}
        onToggleBookmark={toggleBookmark}
      />

      {/* Saved Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedBooks={bookmarkedBooks}
        onSelectBook={setSelectedBook}
        onRemoveBookmark={toggleBookmark}
      />
    </div>
  );
}
