import React from 'react';
import { ArrowRight } from 'lucide-react';
import LocalTime from './LocalTime';

export default function CTASection() {
  return (
    <section id="contact" className="relative w-full pt-40 pb-24 flex flex-col items-center justify-center text-center z-20 bg-[#f4f7f6] overflow-hidden">
      {/* Top Blue Noise/Glow */}
      <div className="absolute top-[180px] left-1/2 -translate-x-1/2 w-[200%] md:w-[150%] h-[350px] bg-blue-400/30 blur-[100px] md:blur-[120px] rounded-[100%] pointer-events-none -z-10" />
      
      <div className="w-full px-6 flex flex-col items-center">
        <h2 className="text-5xl md:text-[5rem] font-outfit font-medium tracking-tight text-slate-900 mb-6 reveal-animate opacity-0 translate-y-12 transition-all duration-1000">
          Let&apos;s Build Something Great
        </h2>
        <p className="text-[17px] md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[200ms]">
          Open to new opportunities, collaborations, and meaningful projects. Let&apos;s build something impactful together.
        </p>
        <div className="reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[400ms]">
          <a href="#" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-outfit font-medium hover:bg-blue-600 hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:-translate-y-1 transition-all duration-300">
            <ArrowRight size={20} />
            Get in Touch
          </a>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 reveal-animate opacity-0 translate-y-12 transition-all duration-1000 delay-[600ms]">
          <p className="text-sm font-medium text-slate-500">Local time <LocalTime /></p>
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/in/radhiyya-alea-akbar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://github.com/radhyy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:shadow-sm transition-all" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="mailto:raaakb87@gmail.com" className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-red-500 hover:border-red-300 hover:shadow-sm transition-all" aria-label="Email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://instagram.com/radhyy._akbar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-pink-600 hover:border-pink-300 hover:shadow-sm transition-all" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
