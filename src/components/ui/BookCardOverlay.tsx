import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookData } from '../../types';
import { BookOpen, Sparkles, Calendar, Tag } from 'lucide-react';

interface BookCardOverlayProps {
  book: BookData | null;
  onInspect: (book: BookData) => void;
}

export const BookCardOverlay: React.FC<BookCardOverlayProps> = ({ book, onInspect }) => {
  return (
    <AnimatePresence>
      {book && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-md pointer-events-auto"
        >
          <div
            className="bg-amber-950/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-5 shadow-2xl text-amber-50 relative overflow-hidden group hover:border-amber-400/50 transition-colors cursor-pointer"
            onClick={() => onInspect(book)}
          >
            {/* Top accent foil stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: book.accentColor }}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/80 text-amber-200 border border-amber-700/50">
                    <Tag className="w-3 h-3 mr-1 text-amber-400" />
                    {book.genre}
                  </span>
                  <span className="text-xs text-amber-300/80 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {book.year}
                  </span>
                  {book.isFeatured && (
                    <span className="text-xs text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold text-amber-100 tracking-wide line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm font-medium text-amber-300/90 italic mb-2">
                  by {book.author}
                </p>
                <p className="text-xs text-amber-200/80 line-clamp-2 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Color swatch badge */}
              <div
                className="w-12 h-16 rounded-lg shadow-inner flex flex-col items-center justify-center p-1 border border-white/10 shrink-0"
                style={{ backgroundColor: book.primaryColor }}
              >
                <BookOpen className="w-5 h-5" style={{ color: book.accentColor }} />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-800/40 flex items-center justify-between text-xs text-amber-300/70">
              <span className="italic truncate max-w-[240px]">"{book.quote}"</span>
              <span className="font-semibold text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
                Click details to read online <BookOpen className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
