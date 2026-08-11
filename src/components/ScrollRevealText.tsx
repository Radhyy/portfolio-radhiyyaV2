"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ScrollRevealText() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const text = t('scrollRevealText');
  const words = text.split(" ");

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = windowHeight - 50; 
      const end = windowHeight / 4;
      
      let p = (start - rect.top) / (start - end);
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="max-w-2xl text-center z-10 px-6 md:px-0 mt-8 mb-16">
      <h2 className="text-2xl md:text-4xl font-semibold leading-snug md:leading-relaxed">
        {words.map((word, i) => {
          const step = i / words.length;
          const isActive = progress > step;
          return (
            <span 
              key={`${word}-${i}`} 
              className={`transition-colors duration-300 ${isActive ? "text-slate-900" : "text-slate-300"}`}
            >
              {word}{" "}
            </span>
          );
        })}
      </h2>
    </div>
  );
}
