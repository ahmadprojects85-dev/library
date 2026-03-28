'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';

const TOTAL_FRAMES = 240;
const ANIMATION_DURATION = 4000; // 4s transition for cinematic effect

export default function VanGoghBackground() {
  const { theme, isTransitioning } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(theme === 'dark' ? TOTAL_FRAMES - 1 : 0);
  const targetFrameRef = useRef(theme === 'dark' ? TOTAL_FRAMES - 1 : 0);
  const requestRef = useRef<number>(null);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const loadedFrames: HTMLImageElement[] = [];
    const targetIdx = theme === 'dark' ? TOTAL_FRAMES - 1 : 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `/animation/ezgif-frame-${frameNum}.jpg`;
      const idx = i - 1;
      
      img.onload = () => {
        loadedCount++;
        // If the target frame for the current theme is loaded, show the canvas
        if (idx === targetIdx) {
          setIsLoaded(true);
        }
        if (loadedCount === TOTAL_FRAMES) {
          console.log('All 240 frames loaded successfully.');
        }
      };
      img.onerror = () => {
        console.error(`Failed to load frame ${frameNum}`);
        loadedCount++;
      };
      loadedFrames.push(img);
    }
    setFrames(loadedFrames);
  }, []);

  // Handle theme change
  useEffect(() => {
    targetFrameRef.current = theme === 'dark' ? TOTAL_FRAMES - 1 : 0;
  }, [theme]);

  // Animation loop
  useEffect(() => {
    if (!isLoaded || !canvasRef.current || frames.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      
      if (Math.abs(diff) > 0.01) {
        const speed = 0.02; // Very slow for clear progression
        currentFrameRef.current += diff * speed;
      }
      
      // Draw the frame
      const frameIndex = Math.round(currentFrameRef.current);
      const img = frames[frameIndex];
      
      if (img) {
        // Automatic Cropping of Black Bars (Top/Bottom 14%)
        const cropTop = img.height * 0.14;
        const cropBottom = img.height * 0.05; // Less bottom crop to keep village lights
        const sourceHeight = img.height - (cropTop + cropBottom);
        
        // Object-fit: cover implementation in Canvas (using cropped source)
        const canvasAspect = canvas.width / canvas.height;
        const sourceAspect = img.width / sourceHeight;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (canvasAspect > sourceAspect) {
          // Landscape: fill width, bias toward bottom (village lights)
          drawWidth = canvas.width;
          drawHeight = canvas.width / sourceAspect;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) * 0.6;
        } else {
          // Portrait (mobile): fill height, bias left to show the moon
          drawHeight = canvas.height;
          drawWidth = canvas.height * sourceAspect;
          // Bias left: 0.35 instead of 0.5 keeps the moon visible
          offsetX = (canvas.width - drawWidth) * 0.35;
          offsetY = 0;
        }
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image using the source rectangle (sx, sy, sWidth, sHeight)
        ctx.drawImage(img, 0, cropTop, img.width, sourceHeight, offsetX, offsetY, drawWidth, drawHeight);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoaded, frames]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isLoaded ? 1 : 0,
        background: 'transparent',
        transition: 'opacity 1s ease, filter 2s ease',
        // Move the blur to the background only
        filter: isTransitioning ? 'blur(10px) brightness(1.1)' : 'none',
      }}
    />
  );
}
