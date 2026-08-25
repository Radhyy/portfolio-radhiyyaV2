"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const IndonesiaFlag = () => (
  <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-2xs overflow-hidden shadow-2xs shrink-0 border border-slate-200/50">
    <rect width="18" height="6.5" fill="#E70011" />
    <rect y="6.5" width="18" height="6.5" fill="#FFFFFF" />
  </svg>
);

const UKFlag = () => (
  <svg width="18" height="13" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-2xs overflow-hidden shadow-2xs shrink-0 border border-slate-200/50">
    <g>
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { language, setLanguage, t } = useLanguage();

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
    { name: t('navHome'), href: isHomePage ? '#home' : '/', id: 'home' },
    { name: t('navProjects'), href: '/projects', id: 'projects' },
    { name: t('navAchievements'), href: isHomePage ? '#certificates' : '/#certificates', id: 'certificates' },
    { name: t('navAbout'), href: isHomePage ? '#about' : '/#about', id: 'about' },
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
          <Link href="/" className="flex items-center gap-2 group shrink-0 transition-transform hover:scale-105">
            <Image 
              src="/LogoRadhiyya.png" 
              alt="Radhiyya Logo" 
              width={120} 
              height={40} 
              className="object-contain h-9 w-auto" 
              priority
            />
            <span className="font-outfit font-bold text-slate-900 text-lg tracking-tight hidden sm:block">
              Portfolio
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/60 p-1 rounded-full border border-slate-200/60 font-outfit">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link);
              return (
                <Link 
                  key={link.id} 
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

          {/* CTA Buttons & Language Switcher */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0 font-outfit">
            {/* Language Selector Pill */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/80 shadow-2xs">
              <button
                onClick={() => setLanguage('ID')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                  language === 'ID'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Bahasa Indonesia"
              >
                <IndonesiaFlag /> ID
              </button>
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                  language === 'EN'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="English"
              >
                <UKFlag /> EN
              </button>
            </div>

            {/* View CV Button (Primary Right Action) */}
            <button 
              onClick={() => setIsCvModalOpen(true)}
              className="px-5 py-2.5 bg-slate-900 text-white text-[13px] font-semibold rounded-full hover:bg-slate-800 transition-all shadow-2xs hover:shadow-md transform hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 8 9"/></svg>
              {t('viewCv')}
            </button>
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
        <div className="fixed inset-0 z-[85] bg-white/95 backdrop-blur-xl md:hidden pt-28 px-6 pb-6 flex flex-col animate-fade-in font-outfit justify-between">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link);
              return (
                <Link 
                  key={link.id} 
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

          <div className="flex flex-col gap-4 pt-6 border-t border-slate-200">
            {/* Language Switcher Mobile */}
            <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 px-3 uppercase tracking-wider">Language / Bahasa:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage('ID')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                    language === 'ID' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <IndonesiaFlag /> ID
                </button>
                <button
                  onClick={() => setLanguage('EN')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                    language === 'EN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <UKFlag /> EN
                </button>
              </div>
            </div>

            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCvModalOpen(true);
              }}
              className="w-full py-3.5 bg-slate-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 8 9"/></svg>
              {t('viewCv')}
            </button>
          </div>
        </div>
      )}

      {/* CV Lightbox Modal */}
      {isCvModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in font-outfit">
          <div className="relative bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl z-10 animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
                <span className="ml-2 text-xs md:text-sm font-semibold text-slate-700">Curriculum Vitae - Radhiyya Alea</span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="/Cv-CreativeRadhiyyaAlea.pdf" 
                  download="Cv-CreativeRadhiyyaAlea.pdf"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  {t('downloadPdf')}
                </a>
                <button 
                  onClick={() => setIsCvModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
              <iframe 
                src="/Cv-CreativeRadhiyyaAlea.pdf" 
                className="w-full h-[65vh] rounded-xl shadow-md border border-slate-200"
                title="Radhiyya Alea CV"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
