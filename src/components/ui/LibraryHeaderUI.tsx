import React, { useState } from 'react';
import { Search, Volume2, VolumeX, Eye, Sun, Sunset, Moon, Sparkles, BookMarked, Filter } from 'lucide-react';
import { CameraPreset, TimeOfDay, AmbientAudioState } from '../../types';
import { audioSynthesizer } from '../../utils/audioSynthesizer';

interface LibraryHeaderUIProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: string[];
  activeCameraPreset: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  timeOfDay: TimeOfDay;
  onSelectTimeOfDay: (time: TimeOfDay) => void;
  bookmarkedCount: number;
  onOpenBookmarksModal: () => void;
}

export const LibraryHeaderUI: React.FC<LibraryHeaderUIProps> = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
  activeCameraPreset,
  onSelectCameraPreset,
  timeOfDay,
  onSelectTimeOfDay,
  bookmarkedCount,
  onOpenBookmarksModal,
}) => {
  const [audioState, setAudioState] = useState<AmbientAudioState>({
    isPlaying: false,
    volume: 0.35,
    soundType: 'fireplace',
  });

  const [showSoundMenu, setShowSoundMenu] = useState(false);

  const toggleAudio = () => {
    if (audioState.isPlaying) {
      audioSynthesizer.stopSound();
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      audioSynthesizer.startSound(audioState.soundType);
      setAudioState((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const changeSoundType = (type: 'fireplace' | 'rain' | 'piano' | 'breeze') => {
    setAudioState((prev) => ({ ...prev, soundType: type }));
    if (audioState.isPlaying) {
      audioSynthesizer.startSound(type);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-2 sm:p-3 pointer-events-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Title Badge */}
        <div className="bg-amber-950/80 backdrop-blur-md border border-amber-600/30 rounded-xl px-3 py-1.5 text-amber-50 shadow-xl pointer-events-auto flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h1 className="font-serif text-xs sm:text-sm font-bold tracking-wider text-amber-100 leading-tight">
              For my book friend
            </h1>
            <p className="text-[9px] text-amber-300/80 italic">
              to Dua - from Mohid
            </p>
          </div>
        </div>

        {/* Central Search & Genre Bar */}
        <div className="flex items-center gap-1.5 pointer-events-auto w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Search Input */}
          <div className="relative flex-1 md:w-52">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400/80" />
            <input
              type="text"
              placeholder="Search title, author..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-amber-950/80 backdrop-blur-md border border-amber-600/30 rounded-lg pl-8 pr-2.5 py-1 text-[11px] text-amber-100 placeholder-amber-400/60 focus:outline-none focus:border-amber-400/80 transition-colors"
            />
          </div>

          {/* Genre Filter */}
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => onGenreChange(e.target.value)}
              className="bg-amber-950/80 backdrop-blur-md border border-amber-600/30 rounded-lg px-2 py-1 text-[11px] text-amber-200 focus:outline-none focus:border-amber-400/80 transition-colors appearance-none pr-6 cursor-pointer"
            >
              <option value="All">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <Filter className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-amber-400/80 pointer-events-none" />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Camera View Switcher */}
          <div className="bg-amber-950/80 backdrop-blur-md border border-amber-600/30 rounded-lg p-0.5 flex items-center gap-0.5 text-[10px]">
            {(
              [
                { id: 'overview', label: 'Room' },
                { id: 'left-shelf', label: 'Left Shelf' },
                { id: 'right-shelf', label: 'Right Shelf' },
                { id: 'window-view', label: 'Window' },
                { id: 'cozy-corner', label: 'Corner' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectCameraPreset(preset.id)}
                className={`px-1.5 py-0.5 rounded transition-all text-[10px] font-medium flex items-center gap-1 ${
                  activeCameraPreset === preset.id
                    ? 'bg-amber-600 text-amber-950 font-bold shadow-sm'
                    : 'text-amber-200/80 hover:bg-amber-900/50'
                }`}
              >
                <Eye className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Time of Day Sunset Switcher */}
          <div className="bg-amber-950/80 backdrop-blur-md border border-amber-600/30 rounded-lg p-0.5 flex items-center gap-0.5">
            <button
              onClick={() => onSelectTimeOfDay('sunset')}
              title="Sunset"
              className={`p-1 rounded transition-colors ${
                timeOfDay === 'sunset' ? 'bg-amber-600 text-amber-950' : 'text-amber-300 hover:bg-amber-900/50'
              }`}
            >
              <Sunset className="w-3 h-3" />
            </button>
            <button
              onClick={() => onSelectTimeOfDay('twilight')}
              title="Twilight"
              className={`p-1 rounded transition-colors ${
                timeOfDay === 'twilight' ? 'bg-amber-600 text-amber-950' : 'text-amber-300 hover:bg-amber-900/50'
              }`}
            >
              <Moon className="w-3 h-3" />
            </button>
            <button
              onClick={() => onSelectTimeOfDay('golden-morning')}
              title="Golden Morning"
              className={`p-1 rounded transition-colors ${
                timeOfDay === 'golden-morning' ? 'bg-amber-600 text-amber-950' : 'text-amber-300 hover:bg-amber-900/50'
              }`}
            >
              <Sun className="w-3 h-3" />
            </button>
          </div>

          {/* Sound Ambiance Control */}
          <div className="relative">
            <button
              onClick={toggleAudio}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowSoundMenu(!showSoundMenu);
              }}
              className={`p-1.5 rounded-lg backdrop-blur-md border border-amber-600/30 transition-all flex items-center gap-1 text-[10px] font-semibold ${
                audioState.isPlaying
                  ? 'bg-amber-500 text-amber-950 shadow-md animate-pulse'
                  : 'bg-amber-950/80 text-amber-200 hover:bg-amber-900/80'
              }`}
              title="Click to toggle audio. Right click for sound options."
            >
              {audioState.isPlaying ? (
                <Volume2 className="w-3 h-3" />
              ) : (
                <VolumeX className="w-3 h-3" />
              )}
            </button>

            {/* Sound Selector Dropdown */}
            {showSoundMenu && (
              <div className="absolute right-0 top-9 w-32 bg-amber-950 border border-amber-600/40 rounded-lg p-1 shadow-2xl space-y-0.5 text-[10px]">
                {(['fireplace', 'rain', 'piano', 'breeze'] as const).map((sType) => (
                  <button
                    key={sType}
                    onClick={() => {
                      changeSoundType(sType);
                      setShowSoundMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded capitalize transition-colors ${
                      audioState.soundType === sType
                        ? 'bg-amber-700 text-amber-100 font-bold'
                        : 'text-amber-200 hover:bg-amber-900/60'
                    }`}
                  >
                    🔥 {sType}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarks Counter Button */}
          {bookmarkedCount > 0 && (
            <button
              onClick={onOpenBookmarksModal}
              className="bg-amber-600 text-amber-950 rounded-lg px-2 py-1 text-[10px] font-bold flex items-center gap-1 shadow-md hover:bg-amber-500 transition-colors"
            >
              <BookMarked className="w-3 h-3" />
              <span>{bookmarkedCount}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
