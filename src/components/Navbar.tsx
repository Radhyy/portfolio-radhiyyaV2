"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      if (!isHomePage) return;

      // Scroll spy for homepage
      const sections = ['home', 'projects', 'certificates', 'about'];
      let current = '';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= (el.offsetTop - 150)) {
          current = section;
        }
      }
      
      if (current) {
        setActiveSection(current);
      } else if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navLinks = [
    { name: 'Home', href: isHomePage ? '#home' : '/', id: 'home' },
    { name: 'Projects', href: '/projects', id: 'projects' },
    { name: 'Achievements', href: isHomePage ? '#certificates' : '/#certificates', id: 'certificates' },
    { name: 'About', href: isHomePage ? '#about' : '/#about', id: 'about' },
  ];

  const checkIsActive = (link: typeof navLinks[0]) => {
    if (pathname?.startsWith('/projects')) {
      return link.id === 'projects';
    }
    if (isHomePage) {
      return activeSection === link.id;
    }
    return false;
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] w-[95%] max-w-[900px] transition-all duration-300">
        <nav 
          className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500
            ${isScrolled 
              ? 'bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50' 
              : 'bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-xs'}`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0 transition-transform hover:scale-105">
            <Image 
              src="/LogoRadhiyya.png" 
              alt="Radhiyya Logo" 
              width={120} 
              height={40} 
              className="object-contain h-9 w-auto" 
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/60 p-1 rounded-full border border-slate-200/60">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link);
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-semibold rounded-full transition-all duration-300
                    ${isActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-white rounded-full shadow-sm -z-10 animate-fade-in"></span>
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsCvModalOpen(true)}
              className="px-5 py-2.5 bg-white text-slate-800 border border-slate-200 text-[13px] font-semibold rounded-full hover:bg-slate-50 transition-all shadow-2xs hover:shadow-md transform hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              View CV
            </button>
            <a 
              href="mailto:raaakb87@gmail.com"
              className="px-5 py-2.5 bg-slate-900 text-white text-[13px] font-semibold rounded-full hover:bg-blue-600 transition-all shadow-2xs hover:shadow-md transform hover:-translate-y-0.5"
            >
              Let's Talk
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-slate-50 rounded-full text-slate-600 border border-slate-200/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`block w-4 h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-4 h-0.5 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-4 h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[85] bg-white/95 backdrop-blur-xl md:hidden pt-28 px-6 pb-6 flex flex-col animate-fade-in font-outfit">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link);
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-outfit font-bold transition-colors
                    ${isActive ? 'text-blue-600' : 'text-slate-800'}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-auto flex flex-col gap-3">
            <button 
              onClick={() => { setIsCvModalOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Preview CV
            </button>
            <a 
              href="mailto:raaakb87@gmail.com"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg"
            >
              Let's Talk
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </a>
          </div>
        </div>
      )}

      {/* CV Preview Modal */}
      {isCvModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-12 animate-fade-in font-outfit">
          <div className="bg-[#f8fafc] w-full h-full max-w-5xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-white">
              <div>
                <h3 className="font-outfit font-bold text-slate-900 text-xl">Curriculum Vitae</h3>
                <p className="text-sm font-medium text-slate-500">Radhiyya Alea</p>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="/Cv-CreativeRadhiyyaAlea.pdf" 
                  download="CV_Radhiyya_Alea.pdf"
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold text-[14px] hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
                </a>
                <button 
                  onClick={() => setIsCvModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden rounded-b-3xl">
              <iframe 
                src="/Cv-CreativeRadhiyyaAlea.pdf#toolbar=0" 
                className="w-full h-full rounded-2xl shadow-inner border border-slate-200 bg-white"
                title="CV Preview"
              />
            </div>

            {/* Mobile Download Button */}
            <div className="sm:hidden p-4 bg-white border-t border-slate-200">
               <a 
                  href="/Cv-CreativeRadhiyyaAlea.pdf" 
                  download="CV_Radhiyya_Alea.pdf"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-[15px] hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
                </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
