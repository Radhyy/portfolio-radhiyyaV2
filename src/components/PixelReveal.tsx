"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PixelReveal({
  children,
  className = "",
  pixelColor = "bg-slate-900", // Dark dramatic pixel reveal
}: {
  children: React.ReactNode;
  className?: string;
  pixelColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridConfig, setGridConfig] = useState({ columns: 0, rows: 0, total: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateGrid = () => {
      const pixelSize = window.innerWidth < 768 ? 40 : 60; 
      const columns = Math.ceil(window.innerWidth / pixelSize);
      const rows = Math.ceil(window.innerHeight / pixelSize);
      setGridConfig({ columns, rows, total: columns * rows });
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  useEffect(() => {
    if (gridConfig.total === 0 || !gridRef.current) return;

    const pixels = gridRef.current.children;
    if (pixels.length === 0) return;

    // Pixel reveal animation using GSAP
    const tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        if (gridRef.current) {
          gridRef.current.style.display = 'none';
        }
      }
    });

    tl.to(".reveal-pixel", {
      scale: 0,
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut",
      stagger: {
        amount: 2.0,
        from: "center",
        grid: [gridConfig.rows, gridConfig.columns],
      },
    }, 0);

    // Fade out the borders along with the boxes so they don't get stuck
    tl.to(".grid-cell", {
      borderColor: "transparent",
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut",
      stagger: {
        amount: 2.0,
        from: "center",
        grid: [gridConfig.rows, gridConfig.columns],
      },
    }, 0);
  }, [gridConfig]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {children}
      
      {gridConfig.total > 0 && (
        <div 
          ref={gridRef}
          className="fixed inset-0 w-screen h-screen z-[100] pointer-events-none flex flex-wrap"
        >
          {Array.from({ length: gridConfig.total }).map((_, i) => (
            <div 
              key={i} 
              className="grid-cell border border-slate-300 flex items-center justify-center"
              style={{ 
                width: `${100 / gridConfig.columns}%`, 
                height: `${100 / gridConfig.rows}%`,
              }} 
            >
              <div className="reveal-pixel w-full h-full bg-white/95 backdrop-blur-md shadow-[inset_0_0_15px_rgba(0,0,0,0.03)]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
