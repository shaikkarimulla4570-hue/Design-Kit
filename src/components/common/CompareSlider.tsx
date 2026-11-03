import React, { useState, useRef, useCallback } from 'react';

interface CompareSliderProps {
  originalUrl: string;
  compressedUrl: string;
  originalLabel?: string;
  compressedLabel?: string;
  originalSizeText?: string;
  compressedSizeText?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  originalUrl,
  compressedUrl,
  originalLabel = 'Original',
  compressedLabel = 'Compressed',
  originalSizeText,
  compressedSizeText,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full select-none">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onClick={(e) => handleMove(e.clientX)}
        className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] bg-slate-900 rounded-2xl overflow-hidden cursor-ew-resize shadow-md border border-slate-200"
      >
        {/* Background Image: Original */}
        <img
          src={originalUrl}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Foreground Image: Compressed (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={compressedUrl}
            alt="Compressed"
            className="absolute inset-0 w-full h-full object-contain max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Vertical divider bar */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 border border-slate-200">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l-4 3 4 3m8-6l4 3-4 3"
              />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-30 pointer-events-none">
          <div className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
            {compressedLabel} {compressedSizeText ? `(${compressedSizeText})` : ''}
          </div>
        </div>

        <div className="absolute top-3 right-3 z-30 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
            {originalLabel} {originalSizeText ? `(${originalSizeText})` : ''}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-black/60 backdrop-blur-sm text-slate-200 text-[11px] px-3 py-1 rounded-full">
          Drag slider left or right to compare quality
        </div>
      </div>
    </div>
  );
};
