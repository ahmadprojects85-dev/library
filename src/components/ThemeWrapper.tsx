'use client';

import { useTheme } from './ThemeProvider';
import { ReactNode } from 'react';

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  const { isTransitioning } = useTheme();

  return (
    <div className={`content-wrapper ${isTransitioning ? 'blur-transition' : ''}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {children}
    </div>
  );
}
