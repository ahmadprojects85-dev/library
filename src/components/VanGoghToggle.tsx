'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export default function VanGoghToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: '56px',
        height: '56px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <AnimatePresence mode="wait">
        {theme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ y: 20, rotate: -45, scale: 0.2, opacity: 0 }}
            animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, rotate: 45, scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF37" // Bronze/Gold for Van Gogh sun
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.5))' }}
            >
              <circle cx="12" cy="12" r="4" fill="#D4AF37" fillOpacity="0.2" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M21 12h-2" />
              <path d="M4 12H2" />
              <path d="m17.66 4.93-1.41 1.41" />
              <path d="m4.93 17.66 1.41 1.41" />
              <path d="M12 8a4 4 0 0 0-4 4" /> {/* Swirl detail */}
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: 20, rotate: -45, scale: 0.2, opacity: 0 }}
            animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, rotate: 45, scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#DFA953" // Night gold for Van Gogh moon
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 8px rgba(223, 169, 83, 0.4))' }}
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" fill="#DFA953" fillOpacity="0.2" />
              <path d="M11 11a2 2 0 0 1 2-2" /> {/* Starry detail */}
              <circle cx="16" cy="16" r="0.5" fill="currentColor" stroke="none" />
              <circle cx="19" cy="8" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
