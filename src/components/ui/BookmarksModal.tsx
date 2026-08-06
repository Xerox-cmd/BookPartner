import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookData } from '../../types';
import { X, BookOpen, Trash2, ArrowRight } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedBooks: BookData[];
  onSelectBook: (book: BookData) => void;
  onRemoveBookmark: (bookId: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarkedBooks,
  onSelectBook,
  onRemoveBookmark,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-xl bg-[#23150c] border border-amber-600/40 rounded-2xl shadow-2xl p-6 text-amber-50"
          >
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-amber-100">
                  Your Saved Library ({bookmarkedBooks.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-amber-900/60 text-amber-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 max-h-[60vh] overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
              {bookmarkedBooks.length === 0 ? (
                <p className="text-center py-6 text-amber-300/60 text-xs italic">
                  No bookmarked books yet. Hover over any book on the shelf and click to bookmark it!
                </p>
              ) : (
                bookmarkedBooks.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between gap-2.5 p-2.5 bg-amber-950/60 border border-amber-900/40 rounded-xl hover:border-amber-500/40 transition-colors"
                  >
                    <div
                      className="w-9 h-12 rounded shadow flex items-center justify-center shrink-0 border border-amber-400/20"
                      style={{ backgroundColor: b.primaryColor }}
                    >
                      <BookOpen className="w-3.5 h-3.5" style={{ color: b.accentColor }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-xs text-amber-100 truncate">
                        {b.title}
                      </h4>
                      <p className="text-[10px] text-amber-300/80 italic truncate">
                        {b.author} • {b.genre}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSelectBook(b);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-amber-950 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        Read <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(b.id)}
                        className="p-1 rounded-md text-amber-400/60 hover:text-red-400 hover:bg-amber-900/50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
