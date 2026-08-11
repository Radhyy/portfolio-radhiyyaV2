"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-8 border-t border-slate-200/60 bg-[#f4f7f6]">
      <div className="max-w-[1300px] px-6 lg:px-16 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-[15px] font-medium font-outfit">
          © {new Date().getFullYear()} Radhiyya Alea. {t('footerRights')}
        </p>
        <div className="flex gap-6 font-outfit">
          <a href="https://www.linkedin.com/in/radhiyya-alea-akbar" target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-slate-500 hover:text-blue-600 transition-colors">LinkedIn</a>
          <a href="https://instagram.com/radhyy._akbar" target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-slate-500 hover:text-pink-600 transition-colors">Instagram</a>
          <a href="mailto:raaakb87@gmail.com" className="text-[15px] font-semibold text-slate-500 hover:text-green-600 transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}
