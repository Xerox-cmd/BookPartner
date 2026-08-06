import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookData } from '../../types';
import { X, BookOpen, Bookmark, Star, Calendar, ArrowLeft, ArrowRight, Quote, ExternalLink, Sparkles } from 'lucide-react';

interface BookModalProps {
  book: BookData | null;
  onClose: () => void;
  onSelectNext?: () => void;
  onSelectPrev?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (bookId: string) => void;
}

export const BookModal: React.FC<BookModalProps> = ({
  book,
  onClose,
  onSelectNext,
  onSelectPrev,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  return (
    <AnimatePresence>
      {book && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl bg-[#23150c] border border-amber-600/30 rounded-2xl shadow-2xl overflow-hidden text-amber-50"
          >
            {/* Top Bar Accent */}
            <div
              className="h-2 w-full"
              style={{ backgroundColor: book.accentColor }}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-amber-950/60 hover:bg-amber-900 text-amber-300 hover:text-amber-100 transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              {/* Header Info Section */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Book Spine / Cover Preview Box */}
                <div
                  className="w-28 h-40 rounded-xl shadow-2xl flex flex-col justify-between p-3 shrink-0 border border-amber-400/20 relative group"
                  style={{ backgroundColor: book.primaryColor }}
                >
                  <div className="flex justify-between items-center text-xs text-amber-200">
                    <span>{book.year}</span>
                    <Star className="w-3.5 h-3.5" style={{ color: book.accentColor }} />
                  </div>
                  <div className="my-auto text-center">
                    <p className="font-serif font-bold text-sm text-amber-100 line-clamp-2">
                      {book.title}
                    </p>
                    <p className="text-[10px] text-amber-300/80 italic mt-1">
                      {book.author}
                    </p>
                  </div>
                  <div
                    className="h-1 rounded-full w-full"
                    style={{ backgroundColor: book.accentColor }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700/50">
                      {book.genre}
                    </span>
                    <span className="text-xs text-amber-300/70 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Published {book.year}
                    </span>
                    <span className="text-xs text-amber-300/70 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {book.pages} pages
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl font-bold text-amber-100 tracking-wide">
                    {book.title}
                  </h2>
                  <p className="text-base font-medium text-amber-300/90 italic mt-1">
                    By {book.author}
                  </p>

                  <p className="text-sm text-amber-200/90 leading-relaxed mt-4">
                    {book.description}
                  </p>

                  {/* Story Motif Badge */}
                  {book.storyMotif && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-amber-950/40 border border-amber-800/40 rounded-lg text-xs text-amber-300/90">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Custom Cover Design: <strong className="text-amber-200 capitalize">{book.storyMotif.replace(/-/g, ' ')}</strong> motif</span>
                    </div>
                  )}

                  {/* Read Online Primary Direct Link */}
                  <div className="mt-3">
                    <a
                      href={book.readUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500 text-amber-950 hover:bg-amber-400 shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Read Book Online
                    </a>
                  </div>
                </div>
              </div>

              {/* Famous Quote Highlight Box */}
              <div className="bg-amber-950/60 border-l-4 border-amber-500 rounded-r-xl p-4 italic text-amber-200 text-sm relative">
                <Quote className="w-6 h-6 text-amber-500/30 absolute top-2 right-2" />
                "{book.quote}"
              </div>

              {/* Excerpt Reading Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Excerpt Reader
                </h4>
                <div className="bg-[#180d06] border border-amber-900/40 rounded-xl p-4 text-sm text-amber-100/90 leading-relaxed font-serif">
                  <p>{book.excerpt}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-amber-900/50">
                <div className="flex items-center gap-1.5">
                  {onSelectPrev && (
                    <button
                      onClick={onSelectPrev}
                      className="px-2.5 py-1 rounded-md bg-amber-950/80 hover:bg-amber-900 text-amber-300 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Prev
                    </button>
                  )}
                  {onSelectNext && (
                    <button
                      onClick={onSelectNext}
                      className="px-2.5 py-1 rounded-md bg-amber-950/80 hover:bg-amber-900 text-amber-300 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      Next <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={book.readUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500 text-amber-950 hover:bg-amber-400 shadow-sm flex items-center gap-1 transition-all hover:scale-105"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Read Online
                  </a>

                  <button
                    onClick={() => onToggleBookmark?.(book.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                      isBookmarked
                        ? 'bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-sm'
                        : 'bg-amber-900/70 text-amber-200 hover:bg-amber-800 border border-amber-700/50'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-950' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Bookmark'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
